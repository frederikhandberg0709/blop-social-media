import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const userSockets = new Map<string, string[]>();

io.on("connection", (socket) => {
  console.log('Client connected');
  
  let userId: string | null = null;

  socket.on("authenticate", (id: string) => {
    userId = id;
    const userSocketIds = userSockets.get(id) || [];
    userSockets.set(id, [...userSocketIds, socket.id]);
    socket.join(`user-${id}`);
    console.log(`User ${id} authenticated`);
  });

  socket.on("disconnect", () => {
    if (userId) {
      const userSocketIds = userSockets.get(userId) || [];
      const updatedSockets = userSocketIds.filter(id => id !== socket.id);
      
      if (updatedSockets.length === 0) {
        userSockets.delete(userId);
      } else {
        userSockets.set(userId, updatedSockets);
      }
      
      console.log(`User ${userId} disconnected`);
    }
  });
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});