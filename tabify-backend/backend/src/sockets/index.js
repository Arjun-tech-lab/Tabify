import { Server } from "socket.io";
import { allowedOrigins } from "../config/cors.js";
import { registerSocketEvents } from "./events.js";

export const initSockets = (server, app) => {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  app.set("io", io);

  io.on("connection", (socket) => {
    console.log("🔌 Connected:", socket.id);
    registerSocketEvents(io, socket);
  });
};
