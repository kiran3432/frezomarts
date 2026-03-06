import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { authenticateRequest } from "../auth/auth.guard.js";

const auditQuerySchema = z.object({
  action: z.string().optional(),
  actorRole: z.enum(["RIDER", "CAPTAIN", "ADMIN"]).optional(),
  status: z.enum(["SUCCESS", "FAILED"]).optional(),
  limit: z.coerce.number().optional()
});

export function registerAuditRoutes(app: FastifyInstance) {
  app.get("/admin/audit-logs", async (request, reply) => {
    const claims = authenticateRequest(request, reply, ["ADMIN"]);
    if (!claims) {
      return;
    }
    const parsed = auditQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid query", issues: parsed.error.issues });
    }
    const limit = Math.max(1, Math.min(parsed.data.limit ?? 100, 500));
    return prisma.auditLog.findMany({
      where: {
        ...(parsed.data.action ? { action: parsed.data.action } : {}),
        ...(parsed.data.actorRole ? { actorRole: parsed.data.actorRole } : {}),
        ...(parsed.data.status ? { status: parsed.data.status } : {})
      },
      orderBy: { createdAt: "desc" },
      take: limit
    });
  });
}

