import type { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { authenticateRequest } from "../auth/auth.guard.js";

export function registerInvoiceRoutes(app: FastifyInstance) {
  app.get<{ Params: { rideId: string } }>("/invoices/rides/:rideId", async (request, reply) => {
    const claims = authenticateRequest(request, reply);
    if (!claims) {
      return;
    }

    const ride = await prisma.ride.findUnique({ where: { id: request.params.rideId } });
    if (!ride) {
      return reply.status(404).send({ message: "Ride not found" });
    }

    const payout = await prisma.captainPayout.findUnique({
      where: { rideId: ride.id }
    });

    const amount = ride.finalFare ?? ride.estimatedFare;
    return {
      invoiceId: `INV-${ride.id.slice(0, 10).toUpperCase()}`,
      generatedAt: new Date().toISOString(),
      ride: {
        id: ride.id,
        riderId: ride.riderId,
        captainId: ride.captainId,
        status: ride.status,
        pickup: { lat: ride.pickupLat, lng: ride.pickupLng },
        drop: { lat: ride.dropLat, lng: ride.dropLng },
        createdAt: ride.createdAt,
        completedAt: ride.status === "COMPLETED" ? ride.updatedAt : null
      },
      fare: {
        estimatedFare: ride.estimatedFare,
        finalFare: ride.finalFare,
        payableAmount: amount
      },
      payment: {
        status: ride.paymentStatus,
        method: ride.paymentMethod,
        collectedAt: ride.paymentCollectedAt
      },
      payout: payout
        ? {
            grossAmount: payout.grossAmount,
            commission: payout.commission,
            netAmount: payout.netAmount,
            status: payout.status,
            settledAt: payout.settledAt
          }
        : null
    };
  });
}

