import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../../config/env.js";
import type { AuthClaims, UserRole } from "./auth.types.js";

const claimsSchema = z.object({
  sub: z.string().min(1),
  phoneNumber: z.string().min(1),
  role: z.enum(["RIDER", "CAPTAIN", "ADMIN"]),
  tokenType: z.enum(["access", "refresh"])
});

function extractBearerToken(request: FastifyRequest) {
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }
  return authorization.slice("Bearer ".length).trim();
}

export function authenticateRequest(
  request: FastifyRequest,
  reply: FastifyReply,
  allowedRoles?: UserRole[]
): AuthClaims | null {
  const token = extractBearerToken(request);
  if (!token) {
    reply.status(401).send({ message: "Missing Bearer token" });
    return null;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const parsed = claimsSchema.safeParse(decoded);
    if (!parsed.success) {
      reply.status(401).send({ message: "Invalid token claims" });
      return null;
    }
    const claims = parsed.data as AuthClaims;
    if (claims.tokenType !== "access") {
      reply.status(401).send({ message: "Access token required" });
      return null;
    }
    if (allowedRoles && !allowedRoles.includes(claims.role)) {
      reply.status(403).send({ message: "Insufficient role permissions" });
      return null;
    }
    return claims;
  } catch {
    reply.status(401).send({ message: "Invalid or expired token" });
    return null;
  }
}
