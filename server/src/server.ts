import dotenv from "dotenv";
import express, {Request, RequestHandler, Response} from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
}));

app.use(express.json());

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

interface NotifyRequest {
    userIds: string[];
    notification: {
      type: string;
      postId: string;
      postTitle: string;
    };
  }

const notifyHandler: RequestHandler = (req, res) => {
    console.log('Received notify request');
    console.log('Request body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    
    try {
        if (!req.body) {
            throw new Error('Request body is empty');
        }      
        
        const { userIds, notification } = req.body as NotifyRequest;

        if (!userIds || !notification) {
             res.status(400).json({ 
              error: 'Missing required fields',
              received: req.body 
            });
            return;
        }
      
        console.log('Processing notification for users:', userIds)

        userIds.forEach((userId: string) => {
            console.log(`Emitting to user-${userId}`);
            io.to(`user-${userId}`).emit("notification", notification);
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
};

app.post('/notify', notifyHandler);

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});