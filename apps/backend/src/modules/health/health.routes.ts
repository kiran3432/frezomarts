import type { FastifyInstance } from "fastify";

export function registerHealthRoutes(app: FastifyInstance) {
  app.get("/health", async () => ({
    status: "ok",
    service: "rapido-backend",
    timestamp: new Date().toISOString()
  }));
}

