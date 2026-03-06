import type { FastifyRequest } from "fastify";
import type { JsonObject } from "@prisma/client/runtime/library";
import { prisma } from "../../lib/prisma.js";
import type { AuthClaims } from "../auth/auth.types.js";

interface AuditInput {
  action: string;
  resourceType: string;
  resourceId?: string;
  status: "SUCCESS" | "FAILED";
  metadata?: JsonObject;
}

export async function writeAuditLog(
  request: FastifyRequest,
  claims: AuthClaims | null,
  input: AuditInput
) {
  await prisma.auditLog.create({
    data: {
      actorUserId: claims?.sub,
      actorRole: claims?.role,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      status: input.status,
      ip: request.ip,
      userAgent: request.headers["user-agent"],
      metadata: input.metadata
    }
  });
}

