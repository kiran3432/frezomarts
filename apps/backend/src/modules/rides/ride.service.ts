import type { Ride as DbRide } from "@prisma/client";
import type { LatLng, PaymentStatus, Ride, RideStatus } from "../../contracts/ride.js";
import { prisma } from "../../lib/prisma.js";

interface CreateRideInput {
  riderId: string;
  pickup: LatLng;
  drop: LatLng;
}

interface RideHistoryFilters {
  status?: RideStatus;
  paymentStatus?: PaymentStatus;
  riderId?: string;
  captainId?: string;
  q?: string;
  limit?: number;
}

type RideMutationError =
  | "RIDE_NOT_FOUND"
  | "CAPTAIN_NOT_FOUND"
  | "CAPTAIN_NOT_AVAILABLE"
  | "RIDE_ALREADY_ASSIGNED"
  | "CANNOT_CANCEL_AFTER_START"
  | "RIDE_ALREADY_TERMINAL";

interface RideMutationResult {
  ride: Ride | null;
  error?: RideMutationError;
}

function estimateFare(pickup: LatLng, drop: LatLng): number {
  const distance = Math.sqrt(
    Math.pow(drop.lat - pickup.lat, 2) + Math.pow(drop.lng - pickup.lng, 2)
  );
  return Number((35 + distance * 250).toFixed(2));
}

function getSurgeRule(pickup: LatLng) {
  const hour = new Date().getHours();
  const inPeakHour = (hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 21);
  const inAirportZone = pickup.lat >= 12.94 && pickup.lat <= 13.05 && pickup.lng >= 77.62 && pickup.lng <= 77.72;
  const inCentralZone = pickup.lat >= 12.94 && pickup.lat <= 12.99 && pickup.lng >= 77.56 && pickup.lng <= 77.63;

  if (inAirportZone && inPeakHour) {
    return { surgeMultiplier: 1.8, surgeLabel: "Airport Peak Surge" };
  }
  if (inAirportZone) {
    return { surgeMultiplier: 1.5, surgeLabel: "Airport Surge" };
  }
  if (inCentralZone && inPeakHour) {
    return { surgeMultiplier: 1.4, surgeLabel: "City Peak Surge" };
  }
  if (inPeakHour) {
    return { surgeMultiplier: 1.2, surgeLabel: "Peak Hour Surge" };
  }
  return { surgeMultiplier: 1, surgeLabel: null as string | null };
}

function toRide(ride: DbRide): Ride {
  return {
    id: ride.id,
    riderId: ride.riderId,
    captainId: ride.captainId ?? undefined,
    pickup: { lat: ride.pickupLat, lng: ride.pickupLng },
    drop: { lat: ride.dropLat, lng: ride.dropLng },
    estimatedFare: ride.estimatedFare,
    finalFare: ride.finalFare ?? undefined,
    cancelReason: ride.cancelReason ?? undefined,
    surgeMultiplier: ride.surgeMultiplier,
    surgeLabel: ride.surgeLabel ?? undefined,
    paymentStatus: ride.paymentStatus,
    paymentMethod: ride.paymentMethod ?? undefined,
    paymentCollectedAt: ride.paymentCollectedAt?.toISOString(),
    status: ride.status as RideStatus,
    createdAt: ride.createdAt.toISOString(),
    updatedAt: ride.updatedAt.toISOString()
  };
}

function haversineKm(a: LatLng, b: LatLng): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return earthRadiusKm * y;
}

async function findNearestAvailableCaptain(pickup: LatLng) {
  const captains = await prisma.captain.findMany({
    where: { isOnline: true, isAvailable: true }
  });

  let nearest: { id: string; distanceKm: number } | null = null;
  for (const captain of captains) {
    const distanceKm = haversineKm(pickup, { lat: captain.currentLat, lng: captain.currentLng });
    if (!nearest || distanceKm < nearest.distanceKm) {
      nearest = { id: captain.id, distanceKm };
    }
  }
  return nearest;
}

export const rideService = {
  async createRide(input: CreateRideInput): Promise<Ride> {
    const nearestCaptain = await findNearestAvailableCaptain(input.pickup);
    const surge = getSurgeRule(input.pickup);

    const ride = await prisma.$transaction(async (tx) => {
      const baseFare = estimateFare(input.pickup, input.drop);
      const surgedFare = Number((baseFare * surge.surgeMultiplier).toFixed(2));
      const created = await tx.ride.create({
        data: {
          riderId: input.riderId,
          pickupLat: input.pickup.lat,
          pickupLng: input.pickup.lng,
          dropLat: input.drop.lat,
          dropLng: input.drop.lng,
          estimatedFare: surgedFare,
          surgeMultiplier: surge.surgeMultiplier,
          surgeLabel: surge.surgeLabel,
          status: "REQUESTED"
        }
      });

      if (!nearestCaptain) {
        return created;
      }

      const claimedCaptain = await tx.captain.updateMany({
        where: {
          id: nearestCaptain.id,
          isOnline: true,
          isAvailable: true
        },
        data: { isAvailable: false }
      });

      if (claimedCaptain.count === 0) {
        return created;
      }

      return tx.ride.update({
        where: { id: created.id },
        data: {
          captainId: nearestCaptain.id,
          status: "DRIVER_ASSIGNED"
        }
      });
    });

    return toRide(ride);
  },

  async listRides() {
    const rides = await prisma.ride.findMany({
      orderBy: { createdAt: "desc" }
    });
    return rides.map(toRide);
  },

  async listHistory(filters: RideHistoryFilters) {
    const limit = Math.max(1, Math.min(filters.limit ?? 100, 500));
    const rides = await prisma.ride.findMany({
      where: {
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.paymentStatus ? { paymentStatus: filters.paymentStatus } : {}),
        ...(filters.riderId ? { riderId: filters.riderId } : {}),
        ...(filters.captainId ? { captainId: filters.captainId } : {}),
        ...(filters.q
          ? {
              OR: [
                { id: { contains: filters.q, mode: "insensitive" } },
                { riderId: { contains: filters.q, mode: "insensitive" } },
                { captainId: { contains: filters.q, mode: "insensitive" } }
              ]
            }
          : {})
      },
      orderBy: { createdAt: "desc" },
      take: limit
    });
    return rides.map(toRide);
  },

  async getRide(rideId: string) {
    const ride = await prisma.ride.findUnique({ where: { id: rideId } });
    return ride ? toRide(ride) : null;
  },

  async assignCaptain(rideId: string, captainId: string): Promise<RideMutationResult> {
    const ride = await prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride) {
      return { ride: null, error: "RIDE_NOT_FOUND" };
    }
    if (ride.captainId) {
      return { ride: null, error: "RIDE_ALREADY_ASSIGNED" };
    }

    const captain = await prisma.captain.findUnique({ where: { id: captainId } });
    if (!captain) {
      return { ride: null, error: "CAPTAIN_NOT_FOUND" };
    }
    if (!captain.isOnline || !captain.isAvailable) {
      return { ride: null, error: "CAPTAIN_NOT_AVAILABLE" };
    }

    const updated = await prisma.$transaction(async (tx) => {
      const claimedCaptain = await tx.captain.updateMany({
        where: {
          id: captainId,
          isOnline: true,
          isAvailable: true
        },
        data: { isAvailable: false }
      });

      if (claimedCaptain.count === 0) {
        return null;
      }

      return tx.ride.update({
        where: { id: rideId },
        data: {
          captainId,
          status: "DRIVER_ASSIGNED"
        }
      });
    });

    if (!updated) {
      return { ride: null, error: "CAPTAIN_NOT_AVAILABLE" };
    }
    return { ride: toRide(updated) };
  },

  async autoAssignNearestCaptain(rideId: string): Promise<RideMutationResult> {
    const ride = await prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride) {
      return { ride: null, error: "RIDE_NOT_FOUND" };
    }
    if (ride.captainId) {
      return { ride: null, error: "RIDE_ALREADY_ASSIGNED" };
    }
    const nearestCaptain = await findNearestAvailableCaptain({
      lat: ride.pickupLat,
      lng: ride.pickupLng
    });
    if (!nearestCaptain) {
      return { ride: null, error: "CAPTAIN_NOT_AVAILABLE" };
    }
    return rideService.assignCaptain(rideId, nearestCaptain.id);
  },

  async updateStatus(rideId: string, status: RideStatus): Promise<RideMutationResult> {
    const ride = await prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride) {
      return { ride: null, error: "RIDE_NOT_FOUND" };
    }
    if (ride.status === "COMPLETED" || ride.status === "CANCELLED") {
      return { ride: null, error: "RIDE_ALREADY_TERMINAL" };
    }

    const shouldReleaseCaptain = (status === "COMPLETED" || status === "CANCELLED") && !!ride.captainId;
    const updated = await prisma.$transaction(async (tx) => {
      if (shouldReleaseCaptain) {
        await tx.captain.updateMany({
          where: { id: ride.captainId ?? "" },
          data: { isAvailable: true }
        });
      }
      return tx.ride.update({
        where: { id: rideId },
        data: {
          status,
          finalFare: status === "COMPLETED" ? ride.estimatedFare : ride.finalFare
        }
      });
    });

    return { ride: toRide(updated) };
  },

  async cancelRide(rideId: string, reason?: string): Promise<RideMutationResult> {
    const ride = await prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride) {
      return { ride: null, error: "RIDE_NOT_FOUND" };
    }
    if (ride.status === "COMPLETED" || ride.status === "CANCELLED") {
      return { ride: null, error: "RIDE_ALREADY_TERMINAL" };
    }
    if (ride.status === "STARTED") {
      return { ride: null, error: "CANNOT_CANCEL_AFTER_START" };
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (ride.captainId) {
        await tx.captain.updateMany({
          where: { id: ride.captainId },
          data: { isAvailable: true }
        });
      }

      return tx.ride.update({
        where: { id: rideId },
        data: {
          status: "CANCELLED",
          cancelReason: reason ?? null
        }
      });
    });

    return { ride: toRide(updated) };
  }
};
