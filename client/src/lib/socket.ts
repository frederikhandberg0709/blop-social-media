import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

export const initSocket = () => {
  const socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("Socket connected with ID:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.log("Socket connection error:", error);
  });

  socket.onAny((eventName, ...args) => {
    console.log("Received socket event:", eventName, args);
  });

  return socket;
};
