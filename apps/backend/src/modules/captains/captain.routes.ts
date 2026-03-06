import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { writeAuditLog } from "../audit/audit.service.js";
import { authenticateRequest } from "../auth/auth.guard.js";

const captainLocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  isOnline: z.boolean().optional(),
  isAvailable: z.boolean().optional()
});

export function registerCaptainRoutes(app: FastifyInstance) {
  app.get("/captains/available", async (request, reply) => {
    const claims = authenticateRequest(request, reply);
    if (!claims) {
      return;
    }
    return prisma.captain.findMany({
      where: { isOnline: true, isAvailable: true },
      orderBy: { updatedAt: "desc" }
    });
  });

  app.get<{ Params: { id: string } }>("/captains/:id", async (request, reply) => {
    const claims = authenticateRequest(request, reply);
    if (!claims) {
      return;
    }
    const captain = await prisma.captain.findUnique({ where: { id: request.params.id } });
    if (!captain) {
      return reply.status(404).send({ message: "Captain not found" });
    }
    return captain;
  });

  app.post<{ Params: { id: string } }>("/captains/:id/location", async (request, reply) => {
    const claims = authenticateRequest(request, reply, ["CAPTAIN", "ADMIN"]);
    if (!claims) {
      return;
    }
    const parsed = captainLocationSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid payload", issues: parsed.error.issues });
    }

    const existing = await prisma.captain.findUnique({ where: { id: request.params.id } });
    if (!existing) {
      return reply.status(404).send({ message: "Captain not found" });
    }

    const updated = await prisma.captain.update({
      where: { id: request.params.id },
      data: {
        currentLat: parsed.data.lat,
        currentLng: parsed.data.lng,
        isOnline: parsed.data.isOnline ?? existing.isOnline,
        isAvailable: parsed.data.isAvailable ?? existing.isAvailable
      }
    });
    await writeAuditLog(request, claims, {
      action: "CAPTAIN_LOCATION_UPDATE",
      resourceType: "CAPTAIN",
      resourceId: request.params.id,
      status: "SUCCESS",
      metadata: { lat: parsed.data.lat, lng: parsed.data.lng }
    });
    return updated;
  });
}
