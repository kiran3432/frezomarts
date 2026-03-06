import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { writeAuditLog } from "../audit/audit.service.js";
import { authenticateRequest } from "../auth/auth.guard.js";

const paymentMethodSchema = z.object({
  method: z.enum(["CASH", "UPI", "CARD"])
});

export function registerPaymentRoutes(app: FastifyInstance) {
  app.get<{ Params: { rideId: string } }>("/payments/rides/:rideId", async (request, reply) => {
    const claims = authenticateRequest(request, reply);
    if (!claims) {
      return;
    }
    const ride = await prisma.ride.findUnique({ where: { id: request.params.rideId } });
    if (!ride) {
      return reply.status(404).send({ message: "Ride not found" });
    }
    return {
      rideId: ride.id,
      rideStatus: ride.status,
      amount: ride.finalFare ?? ride.estimatedFare,
      paymentStatus: ride.paymentStatus,
      paymentMethod: ride.paymentMethod,
      paymentCollectedAt: ride.paymentCollectedAt
    };
  });

  app.post<{ Params: { rideId: string } }>("/payments/rides/:rideId/collect", async (request, reply) => {
    const claims = authenticateRequest(request, reply, ["RIDER", "ADMIN"]);
    if (!claims) {
      return;
    }
    const parsed = paymentMethodSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid payload", issues: parsed.error.issues });
    }

    const ride = await prisma.ride.findUnique({ where: { id: request.params.rideId } });
    if (!ride) {
      return reply.status(404).send({ message: "Ride not found" });
    }
    if (ride.status !== "COMPLETED") {
      return reply.status(409).send({ message: "Ride must be completed before payment" });
    }
    if (ride.paymentStatus === "PAID") {
      return reply.status(409).send({ message: "Ride is already paid" });
    }

    const updatedRide = await prisma.$transaction(async (tx) => {
      const updated = await tx.ride.update({
        where: { id: ride.id },
        data: {
          paymentStatus: "PAID",
          paymentMethod: parsed.data.method,
          paymentCollectedAt: new Date()
        }
      });

      if (ride.captainId) {
        const grossAmount = updated.finalFare ?? updated.estimatedFare;
        const commission = Number((grossAmount * 0.2).toFixed(2));
        const netAmount = Number((grossAmount - commission).toFixed(2));
        await tx.captainPayout.create({
          data: {
            captainId: ride.captainId,
            rideId: ride.id,
            grossAmount,
            commission,
            netAmount
          }
        });
      }

      return updated;
    });

    await writeAuditLog(request, claims, {
      action: "PAYMENT_COLLECT",
      resourceType: "PAYMENT",
      resourceId: updatedRide.id,
      status: "SUCCESS",
      metadata: {
        amount: updatedRide.finalFare ?? updatedRide.estimatedFare,
        method: parsed.data.method
      }
    });

    return {
      rideId: updatedRide.id,
      amount: updatedRide.finalFare ?? updatedRide.estimatedFare,
      paymentStatus: updatedRide.paymentStatus,
      paymentMethod: updatedRide.paymentMethod,
      paymentCollectedAt: updatedRide.paymentCollectedAt
    };
  });

  app.get("/payments/pending", async (request, reply) => {
    const claims = authenticateRequest(request, reply, ["ADMIN"]);
    if (!claims) {
      return;
    }
    const rides = await prisma.ride.findMany({
      where: {
        status: "COMPLETED",
        paymentStatus: "PENDING"
      },
      orderBy: { createdAt: "desc" },
      take: 100
    });
    return rides.map((ride) => ({
      rideId: ride.id,
      riderId: ride.riderId,
      captainId: ride.captainId,
      amount: ride.finalFare ?? ride.estimatedFare,
      completedAt: ride.updatedAt
    }));
  });

  app.get<{ Params: { captainId: string } }>("/payouts/captains/:captainId/summary", async (request, reply) => {
    const claims = authenticateRequest(request, reply, ["CAPTAIN", "ADMIN"]);
    if (!claims) {
      return;
    }

    const payouts = await prisma.captainPayout.findMany({
      where: { captainId: request.params.captainId }
    });
    const totalGross = payouts.reduce((sum, item) => sum + item.grossAmount, 0);
    const totalCommission = payouts.reduce((sum, item) => sum + item.commission, 0);
    const totalNet = payouts.reduce((sum, item) => sum + item.netAmount, 0);
    const pendingNet = payouts.filter((p) => p.status === "PENDING").reduce((sum, p) => sum + p.netAmount, 0);
    const settledNet = payouts.filter((p) => p.status === "SETTLED").reduce((sum, p) => sum + p.netAmount, 0);

    return {
      captainId: request.params.captainId,
      rides: payouts.length,
      totalGross: Number(totalGross.toFixed(2)),
      totalCommission: Number(totalCommission.toFixed(2)),
      totalNet: Number(totalNet.toFixed(2)),
      pendingNet: Number(pendingNet.toFixed(2)),
      settledNet: Number(settledNet.toFixed(2))
    };
  });

  app.get<{ Params: { captainId: string } }>("/payouts/captains/:captainId/entries", async (request, reply) => {
    const claims = authenticateRequest(request, reply, ["CAPTAIN", "ADMIN"]);
    if (!claims) {
      return;
    }

    const entries = await prisma.captainPayout.findMany({
      where: { captainId: request.params.captainId },
      orderBy: { createdAt: "desc" },
      take: 200
    });
    return entries;
  });

  app.post<{ Params: { captainId: string } }>("/payouts/captains/:captainId/settle", async (request, reply) => {
    const claims = authenticateRequest(request, reply, ["ADMIN"]);
    if (!claims) {
      return;
    }

    const now = new Date();
    const pending = await prisma.captainPayout.findMany({
      where: {
        captainId: request.params.captainId,
        status: "PENDING"
      }
    });
    if (!pending.length) {
      return { captainId: request.params.captainId, settledCount: 0, settledAmount: 0 };
    }

    await prisma.captainPayout.updateMany({
      where: {
        captainId: request.params.captainId,
        status: "PENDING"
      },
      data: {
        status: "SETTLED",
        settledAt: now
      }
    });

    const settledAmount = pending.reduce((sum, item) => sum + item.netAmount, 0);
    await writeAuditLog(request, claims, {
      action: "PAYOUT_SETTLE",
      resourceType: "PAYOUT",
      resourceId: request.params.captainId,
      status: "SUCCESS",
      metadata: { settledCount: pending.length, settledAmount }
    });
    return {
      captainId: request.params.captainId,
      settledCount: pending.length,
      settledAmount: Number(settledAmount.toFixed(2)),
      settledAt: now
    };
  });
}
