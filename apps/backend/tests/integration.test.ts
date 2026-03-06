import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { prisma } from "../src/lib/prisma.js";
import { buildApp } from "../src/app.js";

let app: FastifyInstance;

async function authToken(phoneNumber: string, role: "RIDER" | "CAPTAIN" | "ADMIN") {
  await app.inject({
    method: "POST",
    url: "/auth/request-otp",
    payload: { phoneNumber }
  });
  const verify = await app.inject({
    method: "POST",
    url: "/auth/verify-otp",
    payload: { phoneNumber, otp: "123456", role }
  });
  const parsed = verify.json();
  return parsed.accessToken as string;
}

describe("Backend integration", () => {
  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  beforeEach(async () => {
    await prisma.auditLog.deleteMany();
    await prisma.captainPayout.deleteMany();
    await prisma.ride.deleteMany();
    await prisma.user.deleteMany();
    await prisma.captain.deleteMany();

    await prisma.captain.createMany({
      data: [
        { id: "captain_1", name: "Arun", currentLat: 12.9698, currentLng: 77.5906, isOnline: true, isAvailable: true },
        { id: "captain_2", name: "Vikram", currentLat: 12.9611, currentLng: 77.6387, isOnline: true, isAvailable: true }
      ]
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it("rejects protected endpoint without bearer token", async () => {
    const response = await app.inject({ method: "GET", url: "/rides" });
    expect(response.statusCode).toBe(401);
  });

  it("runs full ride -> payment -> payout settlement flow", async () => {
    const riderToken = await authToken("+919900000001", "RIDER");
    const adminToken = await authToken("+919900000002", "ADMIN");

    const createRide = await app.inject({
      method: "POST",
      url: "/rides",
      headers: { authorization: `Bearer ${riderToken}` },
      payload: {
        riderId: "rider_1",
        pickup: { lat: 12.97, lng: 77.59 },
        drop: { lat: 12.93, lng: 77.62 }
      }
    });
    expect(createRide.statusCode).toBe(201);
    const ride = createRide.json();
    expect(ride.id).toBeTruthy();
    expect(ride.surgeMultiplier).toBeGreaterThanOrEqual(1);

    const start = await app.inject({
      method: "POST",
      url: `/rides/${ride.id}/status`,
      headers: { authorization: `Bearer ${adminToken}` },
      payload: { status: "STARTED" }
    });
    expect(start.statusCode).toBe(200);

    const complete = await app.inject({
      method: "POST",
      url: `/rides/${ride.id}/status`,
      headers: { authorization: `Bearer ${adminToken}` },
      payload: { status: "COMPLETED" }
    });
    expect(complete.statusCode).toBe(200);

    const collect = await app.inject({
      method: "POST",
      url: `/payments/rides/${ride.id}/collect`,
      headers: { authorization: `Bearer ${riderToken}` },
      payload: { method: "UPI" }
    });
    expect(collect.statusCode).toBe(200);
    expect(collect.json().paymentStatus).toBe("PAID");

    const summary = await app.inject({
      method: "GET",
      url: "/payouts/captains/captain_1/summary",
      headers: { authorization: `Bearer ${adminToken}` }
    });
    expect(summary.statusCode).toBe(200);
    expect(summary.json().pendingNet).toBeGreaterThan(0);

    const settle = await app.inject({
      method: "POST",
      url: "/payouts/captains/captain_1/settle",
      headers: { authorization: `Bearer ${adminToken}` }
    });
    expect(settle.statusCode).toBe(200);
    expect(settle.json().settledCount).toBeGreaterThanOrEqual(1);
  });

  it("writes and serves audit logs for admin", async () => {
    const riderToken = await authToken("+919900000003", "RIDER");
    const adminToken = await authToken("+919900000004", "ADMIN");

    const rideResp = await app.inject({
      method: "POST",
      url: "/rides",
      headers: { authorization: `Bearer ${riderToken}` },
      payload: {
        riderId: "rider_2",
        pickup: { lat: 12.96, lng: 77.61 },
        drop: { lat: 12.95, lng: 77.63 }
      }
    });
    expect(rideResp.statusCode).toBe(201);

    const logsResp = await app.inject({
      method: "GET",
      url: "/admin/audit-logs?limit=50",
      headers: { authorization: `Bearer ${adminToken}` }
    });
    expect(logsResp.statusCode).toBe(200);
    const logs = logsResp.json();
    expect(Array.isArray(logs)).toBe(true);
    expect(logs.some((log: { action: string }) => log.action === "RIDE_CREATE")).toBe(true);
  });
});

