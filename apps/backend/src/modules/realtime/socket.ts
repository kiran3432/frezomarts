import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import type { RideEvent } from "../../contracts/ride.js";

export function createSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {
    socket.on("trip:subscribe", (rideId: string) => {
      socket.join(`ride:${rideId}`);
    });

    socket.on("trip:unsubscribe", (rideId: string) => {
      socket.leave(`ride:${rideId}`);
    });
  });

  return {
    io,
    broadcastRideEvent(event: RideEvent) {
      io.to(`ride:${event.rideId}`).emit("trip:update", event);
    }
  };
}

