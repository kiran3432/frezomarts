import type { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";
import { writeAuditLog } from "../audit/audit.service.js";
import type { AuthClaims, UserRole } from "./auth.types.js";

const requestOtpSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/, "Phone number must be E.164-like format")
});

const verifyOtpSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/, "Phone number must be E.164-like format"),
  otp: z.string().length(6),
  role: z.enum(["RIDER", "CAPTAIN", "ADMIN"]).default("RIDER")
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1)
});

const otpStore = new Map<string, { otp: string; expiresAt: number }>();

function issueToken(
  payload: { sub: string; phoneNumber: string; role: UserRole; tokenType: "access" | "refresh" },
  expiresIn: jwt.SignOptions["expiresIn"]
) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}

export function registerAuthRoutes(app: FastifyInstance) {
  app.post("/auth/request-otp", async (request, reply) => {
    const parsed = requestOtpSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid payload", issues: parsed.error.issues });
    }
    const otp = "123456";
    otpStore.set(parsed.data.phoneNumber, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });
    await writeAuditLog(request, null, {
      action: "AUTH_REQUEST_OTP",
      resourceType: "AUTH",
      status: "SUCCESS",
      metadata: { phoneNumber: parsed.data.phoneNumber }
    });
    return {
      success: true,
      message: "OTP dispatched (dev mode)",
      requestId: `otp_${Date.now()}`,
      devOtp: otp
    };
  });

  app.post("/auth/verify-otp", async (request, reply) => {
    const parsed = verifyOtpSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid payload", issues: parsed.error.issues });
    }
    const otpRecord = otpStore.get(parsed.data.phoneNumber);
    if (!otpRecord || otpRecord.otp !== parsed.data.otp || Date.now() > otpRecord.expiresAt) {
      await writeAuditLog(request, null, {
        action: "AUTH_VERIFY_OTP",
        resourceType: "AUTH",
        status: "FAILED",
        metadata: { phoneNumber: parsed.data.phoneNumber }
      });
      return reply.status(401).send({ message: "Invalid or expired OTP" });
    }

    const user = await prisma.user.upsert({
      where: { phoneNumber: parsed.data.phoneNumber },
      create: {
        phoneNumber: parsed.data.phoneNumber,
        role: parsed.data.role
      },
      update: {}
    });

    const role = (user.role as UserRole) || parsed.data.role;
    const accessToken = issueToken(
      { sub: user.id, phoneNumber: user.phoneNumber, role, tokenType: "access" },
      "15m"
    );
    const refreshToken = issueToken(
      { sub: user.id, phoneNumber: user.phoneNumber, role, tokenType: "refresh" },
      "7d"
    );
    otpStore.delete(parsed.data.phoneNumber);

    await writeAuditLog(
      request,
      { sub: user.id, phoneNumber: user.phoneNumber, role, tokenType: "access" },
      {
        action: "AUTH_VERIFY_OTP",
        resourceType: "AUTH",
        status: "SUCCESS",
        metadata: { phoneNumber: user.phoneNumber, role }
      }
    );

    return {
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        role
      }
    };
  });

  app.post("/auth/refresh", async (request, reply) => {
    const parsed = refreshTokenSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid payload", issues: parsed.error.issues });
    }

    try {
      const decoded = jwt.verify(parsed.data.refreshToken, env.JWT_SECRET);
      const claims = decoded as AuthClaims;
      if (claims.tokenType !== "refresh") {
        await writeAuditLog(request, null, {
          action: "AUTH_REFRESH",
          resourceType: "AUTH",
          status: "FAILED"
        });
        return reply.status(401).send({ message: "Refresh token required" });
      }

      const user = await prisma.user.findUnique({ where: { id: claims.sub } });
      if (!user) {
        await writeAuditLog(request, null, {
          action: "AUTH_REFRESH",
          resourceType: "AUTH",
          status: "FAILED"
        });
        return reply.status(401).send({ message: "User not found" });
      }

      const role = user.role as UserRole;
      const accessToken = issueToken(
        { sub: user.id, phoneNumber: user.phoneNumber, role, tokenType: "access" },
        "15m"
      );
      const refreshToken = issueToken(
        { sub: user.id, phoneNumber: user.phoneNumber, role, tokenType: "refresh" },
        "7d"
      );

      await writeAuditLog(
        request,
        { sub: user.id, phoneNumber: user.phoneNumber, role, tokenType: "access" },
        {
          action: "AUTH_REFRESH",
          resourceType: "AUTH",
          status: "SUCCESS"
        }
      );

      return {
        success: true,
        accessToken,
        refreshToken
      };
    } catch {
      await writeAuditLog(request, null, {
        action: "AUTH_REFRESH",
        resourceType: "AUTH",
        status: "FAILED"
      });
      return reply.status(401).send({ message: "Invalid or expired refresh token" });
    }
  });
}
