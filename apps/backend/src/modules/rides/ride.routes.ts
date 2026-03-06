import type { FastifyInstance, FastifyReply } from "fastify";
import { z } from "zod";
import type { RideStatus } from "../../contracts/ride.js";
import { writeAuditLog } from "../audit/audit.service.js";
import { authenticateRequest } from "../auth/auth.guard.js";
import { rideService } from "./ride.service.js";

const latLngSchema = z.object({
  lat: z.number(),
  lng: z.number()
});

const createRideSchema = z.object({
  riderId: z.string().min(1),
  pickup: latLngSchema,
  drop: latLngSchema
});

const assignCaptainSchema = z.object({
  captainId: z.string().min(1)
});

const statusSchema = z.object({
  status: z.enum([
    "REQUESTED",
    "DRIVER_ASSIGNED",
    "DRIVER_ARRIVING",
    "STARTED",
    "COMPLETED",
    "CANCELLED"
  ] as [RideStatus, ...RideStatus[]])
});

const historyQuerySchema = z.object({
  status: z
    .enum(["REQUESTED", "DRIVER_ASSIGNED", "DRIVER_ARRIVING", "STARTED", "COMPLETED", "CANCELLED"])
    .optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED"]).optional(),
  riderId: z.string().optional(),
  captainId: z.string().optional(),
  q: z.string().optional(),
  limit: z.coerce.number().optional()
});

const cancelRideSchema = z.object({
  reason: z.string().trim().max(160).optional()
});

function replyRideMutationError(
  error:
    | "RIDE_NOT_FOUND"
    | "CAPTAIN_NOT_FOUND"
    | "CAPTAIN_NOT_AVAILABLE"
    | "RIDE_ALREADY_ASSIGNED"
    | "CANNOT_CANCEL_AFTER_START"
    | "RIDE_ALREADY_TERMINAL",
  reply: FastifyReply
) {
  if (error === "RIDE_NOT_FOUND") {
    return reply.status(404).send({ message: "Ride not found" });
  }
  if (error === "CAPTAIN_NOT_FOUND") {
    return reply.status(404).send({ message: "Captain not found" });
  }
  if (error === "RIDE_ALREADY_ASSIGNED") {
    return reply.status(409).send({ message: "Ride already has a captain assigned" });
  }
  if (error === "CANNOT_CANCEL_AFTER_START") {
    return reply.status(409).send({ message: "Ride cannot be cancelled after it has started" });
  }
  if (error === "RIDE_ALREADY_TERMINAL") {
    return reply.status(409).send({ message: "Ride is already completed or cancelled" });
  }
  return reply.status(409).send({ message: "No available captain found" });
}

export function registerRideRoutes(
  app: FastifyInstance,
  publishRideEvent: (rideId: string, status: RideStatus) => void
) {
  app.get("/rides", async (request, reply) => {
    const claims = authenticateRequest(request, reply);
    if (!claims) {
      return;
    }
    return await rideService.listRides();
  });

  app.get<{ Params: { id: string } }>("/rides/:id", async (request, reply) => {
    const claims = authenticateRequest(request, reply);
    if (!claims) {
      return;
    }
    const ride = await rideService.getRide(request.params.id);
    if (!ride) {
      return reply.status(404).send({ message: "Ride not found" });
    }
    return ride;
  });

  app.post("/rides", async (request, reply) => {
    const claims = authenticateRequest(request, reply, ["RIDER", "ADMIN"]);
    if (!claims) {
      return;
    }
    const parsed = createRideSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid payload", issues: parsed.error.issues });
    }

    const ride = await rideService.createRide(parsed.data);
    await writeAuditLog(request, claims, {
      action: "RIDE_CREATE",
      resourceType: "RIDE",
      resourceId: ride.id,
      status: "SUCCESS",
      metadata: { riderId: ride.riderId }
    });
    publishRideEvent(ride.id, ride.status);
    return reply.status(201).send(ride);
  });

  app.post<{ Params: { id: string } }>("/rides/:id/assign", async (request, reply) => {
    const claims = authenticateRequest(request, reply, ["CAPTAIN", "ADMIN"]);
    if (!claims) {
      return;
    }
    const parsed = assignCaptainSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid payload", issues: parsed.error.issues });
    }
    const result = await rideService.assignCaptain(request.params.id, parsed.data.captainId);
    if (!result.ride && result.error) {
      return replyRideMutationError(result.error, reply);
    }
    if (!result.ride) {
      return reply.status(500).send({ message: "Unexpected assignment error" });
    }
    await writeAuditLog(request, claims, {
      action: "RIDE_ASSIGN_CAPTAIN",
      resourceType: "RIDE",
      resourceId: result.ride.id,
      status: "SUCCESS",
      metadata: { captainId: result.ride.captainId ?? null }
    });
    publishRideEvent(result.ride.id, result.ride.status);
    return result.ride;
  });

  app.post<{ Params: { id: string } }>("/rides/:id/auto-assign", async (request, reply) => {
    const claims = authenticateRequest(request, reply, ["CAPTAIN", "ADMIN"]);
    if (!claims) {
      return;
    }
    const result = await rideService.autoAssignNearestCaptain(request.params.id);
    if (!result.ride && result.error) {
      return replyRideMutationError(result.error, reply);
    }
    if (!result.ride) {
      return reply.status(500).send({ message: "Unexpected assignment error" });
    }
    await writeAuditLog(request, claims, {
      action: "RIDE_AUTO_ASSIGN_CAPTAIN",
      resourceType: "RIDE",
      resourceId: result.ride.id,
      status: "SUCCESS",
      metadata: { captainId: result.ride.captainId ?? null }
    });
    publishRideEvent(result.ride.id, result.ride.status);
    return result.ride;
  });

  app.post<{ Params: { id: string } }>("/rides/:id/status", async (request, reply) => {
    const claims = authenticateRequest(request, reply, ["CAPTAIN", "ADMIN"]);
    if (!claims) {
      return;
    }
    const parsed = statusSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid payload", issues: parsed.error.issues });
    }

    const result = await rideService.updateStatus(request.params.id, parsed.data.status);
    if (!result.ride && result.error) {
      return replyRideMutationError(result.error, reply);
    }
    if (!result.ride) {
      return reply.status(500).send({ message: "Unexpected status update error" });
    }
    await writeAuditLog(request, claims, {
      action: "RIDE_STATUS_UPDATE",
      resourceType: "RIDE",
      resourceId: result.ride.id,
      status: "SUCCESS",
      metadata: { status: result.ride.status }
    });
    publishRideEvent(result.ride.id, result.ride.status);
    return result.ride;
  });

  app.post<{ Params: { id: string } }>("/rides/:id/cancel", async (request, reply) => {
    const claims = authenticateRequest(request, reply, ["RIDER", "ADMIN"]);
    if (!claims) {
      return;
    }
    const parsed = cancelRideSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid payload", issues: parsed.error.issues });
    }

    const result = await rideService.cancelRide(request.params.id, parsed.data.reason);
    if (!result.ride && result.error) {
      return replyRideMutationError(result.error, reply);
    }
    if (!result.ride) {
      return reply.status(500).send({ message: "Unexpected cancel error" });
    }
    await writeAuditLog(request, claims, {
      action: "RIDE_CANCEL",
      resourceType: "RIDE",
      resourceId: result.ride.id,
      status: "SUCCESS",
      metadata: { reason: parsed.data.reason ?? null }
    });
    publishRideEvent(result.ride.id, result.ride.status);
    return result.ride;
  });

  app.get("/rides/history", async (request, reply) => {
    const claims = authenticateRequest(request, reply);
    if (!claims) {
      return;
    }
    const parsed = historyQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid query", issues: parsed.error.issues });
    }
    return rideService.listHistory(parsed.data);
  });

  app.get("/rides/history/export", async (request, reply) => {
    const claims = authenticateRequest(request, reply);
    if (!claims) {
      return;
    }
    const parsed = historyQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid query", issues: parsed.error.issues });
    }
    if (claims.role === "RIDER" && !parsed.data.riderId) {
      return reply.status(403).send({ message: "Rider export requires riderId filter" });
    }
    if (claims.role === "CAPTAIN" && !parsed.data.captainId) {
      return reply.status(403).send({ message: "Captain export requires captainId filter" });
    }
    const rides = await rideService.listHistory(parsed.data);
    const lines = [
      "rideId,riderId,captainId,status,paymentStatus,paymentMethod,estimatedFare,finalFare,surgeMultiplier,surgeLabel,createdAt,updatedAt"
    ];
    for (const ride of rides) {
      const row = [
        ride.id,
        ride.riderId,
        ride.captainId ?? "",
        ride.status,
        ride.paymentStatus,
        ride.paymentMethod ?? "",
        String(ride.estimatedFare),
        String(ride.finalFare ?? ""),
        String(ride.surgeMultiplier),
        (ride.surgeLabel ?? "").replace(/,/g, " "),
        ride.createdAt,
        ride.updatedAt
      ];
      lines.push(row.join(","));
    }
    reply.header("content-type", "text/csv");
    reply.header("content-disposition", "attachment; filename=ride-history.csv");
    await writeAuditLog(request, claims, {
      action: "RIDE_HISTORY_EXPORT",
      resourceType: "RIDE",
      status: "SUCCESS",
      metadata: { rows: rides.length }
    });
    return lines.join("\n");
  });
}
