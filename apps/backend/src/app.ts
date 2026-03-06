import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import { registerAuditRoutes } from "./modules/audit/audit.routes.js";
import { registerAuthRoutes } from "./modules/auth/auth.routes.js";
import { registerCaptainRoutes } from "./modules/captains/captain.routes.js";
import { registerCommerceRoutes } from "./modules/commerce/commerce.routes.js";
import { registerHealthRoutes } from "./modules/health/health.routes.js";
import { registerInvoiceRoutes } from "./modules/invoices/invoice.routes.js";
import { registerPaymentRoutes } from "./modules/payments/payment.routes.js";
import { createSocketServer } from "./modules/realtime/socket.js";
import { registerRideRoutes } from "./modules/rides/ride.routes.js";
import { registerStudioRoutes } from "./modules/studio/studio.routes.js";

export async function buildApp() {
  const app = Fastify({ logger: true });
  const corsOrigins = env.CORS_ORIGIN.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  const corsOriginConfig =
    corsOrigins.length === 0 || (corsOrigins.length === 1 && corsOrigins[0] === "*")
      ? true
      : corsOrigins.length === 1
        ? corsOrigins[0]
        : corsOrigins;
  await app.register(cors, { origin: corsOriginConfig });

  app.get("/", async () => {
    return {
      service: "frezo-backend",
      status: "ok",
      docs: {
        health: "/health",
        studioConfig: "/studio/config",
        studioReset: "/studio/reset"
      }
    };
  });

  registerHealthRoutes(app);
  registerCommerceRoutes(app);
  registerAuthRoutes(app);
  registerAuditRoutes(app);
  registerCaptainRoutes(app);
  registerStudioRoutes(app);
  registerInvoiceRoutes(app);
  registerPaymentRoutes(app);

  const socketServer = createSocketServer(app.server);
  registerRideRoutes(app, (rideId, status) => {
    socketServer.broadcastRideEvent({
      rideId,
      status,
      timestamp: new Date().toISOString()
    });
  });

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  return app;
}
