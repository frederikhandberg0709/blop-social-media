import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

export const initSocket = () => {
  return io(SOCKET_URL);
};
