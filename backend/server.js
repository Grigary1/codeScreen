import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import connectDB from './config/mongodb.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

connectDB();

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('code-change', ({ roomId, code }) => {
    socket.to(roomId).emit('receive-code', code);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

app.get('/', (req, res) => res.send('API Running'));
app.use('/api',userRouter);
app.use('/api',roomRouter);

server.listen(process.env.PORT, () =>
  console.log(`Backend running on port ${process.env.PORT}`)
);
