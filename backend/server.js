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

dotenv.config();

const app = express();
const server = http.createServer(app);

// Use the same origin for both Express CORS and Socket.IO
const frontEndUrl = process.env.CLIENT_URL;

app.use(cors({ origin: frontEndUrl, methods: ['GET', 'POST'] }));
app.use(express.json());

// Connect to MongoDB
connectDB();

// In-memory buffer for each room
const roomBuffers = {}; // { [roomId]: codeString }

// Initialize Socket.IO after DB connect and CORS setup
const io = new Server(server, {
  cors: { origin: frontEndUrl, methods: ['GET', 'POST'] }
});

io.on('connection', (socket) => {
  console.log('[Socket.IO] New connection:', socket.id);

  // join-room now expects an object { roomId, userId }
  socket.on('join-room', async ({ roomId, userId }) => {
    try {
      console.log(`[Socket.IO] ${socket.id} joining room:`, roomId);

      // Store senderId in socket
      socket.data.userId = userId || null;

      // Fetch username once from DB
      if (userId) {
        try {
          const user = await userModel.findById(userId).select('name username');
          socket.data.username = (user && (user.name || user.username)) ? (user.name || user.username) : 'Unknown';
        } catch (err) {
          console.error('[Socket.IO] Error fetching user on join:', err);
          socket.data.username = 'Unknown';
        }
      } else {
        socket.data.username = 'Unknown';
      }

      socket.join(roomId);

      // If there's existing code, send it immediately
      if (roomBuffers[roomId] !== undefined) {
        console.log(`[Socket.IO] Sending buffered code to ${socket.id} for room ${roomId}`);
        socket.emit('receive-code', roomBuffers[roomId]);
      }
    } catch (err) {
      console.error('[Socket.IO] join-room handler error:', err);
    }
  });


  socket.on('code-change', ({ roomId, code }) => {
    console.log(`[Socket.IO] Code change in ${roomId} from ${socket.id}`);

    // Update buffer
    roomBuffers[roomId] = code;

    // Broadcast to everyone else in room
    socket.to(roomId).emit('receive-code', code);
  });

  socket.on('send-chat', ({ roomId, message }) => {
    try {
      const senderName = socket.data.username || 'Unknown';
      const senderId = socket.data.userId || null;
      const timestamp = new Date().toISOString();

      socket.to(roomId).emit('receive-chat', {
        message,
        sender: senderName,
        senderId,
        timestamp
      });

      // Optionally save to DB here
    } catch (err) {
      console.error('[Socket.IO] Error in send-chat:', err);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket.IO] Disconnected:', socket.id, 'because', reason);
  });
});

// Your existing routes
app.get('/', (req, res) => res.send('API Running'));
app.use('/api', userRouter);
app.use('/api', roomRouter);
app.use('/api/interviewer', interviewerRouter);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Backend & Socket.IO listening on port ${PORT}`));
