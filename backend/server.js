// server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import connectDB from './config/mongodb.js';
import roomRouter from './routes/roomRouter.js';
import interviewerRouter from './routes/interviewerRouter.js';
import userModel from './models/userModel.js';
import redisClient from './config/redisClient.js'; // your redis client

dotenv.config();

const app = express();
const server = http.createServer(app);
const frontEndUrl = process.env.CLIENT_URL;

app.use(cors({ origin: frontEndUrl, methods: ['GET', 'POST'] }));
app.use(express.json());

connectDB();

// In-memory buffer for code sharing
const roomBuffers = {}; // { [roomId]: codeString }

const io = new Server(server, {
  cors: { origin: frontEndUrl, methods: ['GET', 'POST'] }
});

io.on('connection', (socket) => {
  console.log('[Socket.IO] New connection:', socket.id);

  socket.on('join-room', async ({ roomId, userId }) => {
    try {
      console.log(`[Socket.IO] ${socket.id} joining room:`, roomId);

      // store userId and username on socket
      socket.data.userId = userId || null;
      if (userId) {
        try {
          const user = await userModel.findById(userId).select('name username');
          socket.data.username = user?.name || user?.username || 'Unknown';
        } catch (err) {
          console.error('[Socket.IO] Error fetching user on join:', err);
          socket.data.username = 'Unknown';
        }
      } else {
        socket.data.username = 'Unknown';
      }

      socket.join(roomId);

      // send existing code buffer (if any)
      if (roomBuffers[roomId] !== undefined) {
        socket.emit('receive-code', roomBuffers[roomId]);
      }

      // Replay recent chat history from Redis as receive-chat events
      try {
        const chatKey = `chat:${roomId}`;
        const storedMessages = await redisClient.lRange(chatKey, 0, -1); // oldest->newest if you use rPush
        if (storedMessages.length > 0) {
          // storedMessages is an array of JSON strings; they come oldest->newest with lRange(0,-1) after rPush
          // emit them in order to the joining socket so client can process them via receive-chat handler
          for (const raw of storedMessages) {
            const parsed = JSON.parse(raw);
            socket.emit('receive-chat', parsed);
          }
        }
      } catch (err) {
        console.error('[Redis] Error loading chat history for', roomId, err);
      }

    } catch (err) {
      console.error('[Socket.IO] join-room handler error:', err);
    }
  });

  socket.on('code-change', ({ roomId, code }) => {
    try {
      console.log(`[Socket.IO] Code change in ${roomId} from ${socket.id}`);
      roomBuffers[roomId] = code;
      socket.to(roomId).emit('receive-code', code);
    } catch (err) {
      console.error('[Socket.IO] code-change error:', err);
    }
  });

  // Now expect clientId from client (for optimistic message matching)
  socket.on('send-chat', async ({ roomId, message, clientId }) => {
    try {
      const senderName = socket.data.username || 'Unknown';
      const senderId = socket.data.userId || null;
      const timestamp = new Date().toISOString();

      const chatObj = {
        message,
        sender: senderName,
        senderId,
        timestamp,
        clientId: clientId || null
      };

      // Persist to Redis (use rPush so the list is chronological oldest->newest)
      const chatKey = `chat:${roomId}`;
      await redisClient.rPush(chatKey, JSON.stringify(chatObj));

      // Optional: trim list to last N messages (e.g., last 100)
      // Keep only last 100 messages
      await redisClient.lTrim(chatKey, -100, -1);

      // Reset TTL to 10 minutes on each new message
      await redisClient.expire(chatKey, 600);

      // Emit to whole room (including sender) in one call
      io.to(roomId).emit('receive-chat', chatObj);

    } catch (err) {
      console.error('[Socket.IO] Error in send-chat:', err);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket.IO] Disconnected:', socket.id, 'because', reason);
  });
});

// Routes
app.get('/', (req, res) => res.send('API Running'));
app.use('/api', userRouter);
app.use('/api', roomRouter);
app.use('/api/interviewer', interviewerRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Backend & Socket.IO listening on port ${PORT}`));