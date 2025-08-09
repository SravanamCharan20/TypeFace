import express from 'express';
import { DBConnection } from './connections/db.js';
import crudOp from './routes/upload.route.js';
import cors from 'cors';
import upload from './models/upload.js';
import AdvConcepts from './routes/advConcepts.js';
import UserRoutes from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import { AutenticateUser, AuthorizeUser } from './middlewares/auth.middleware.js';
import { Server } from 'socket.io';
import http from 'http';
import FoodDetails from './routes/food.routes.js'

const app = express();
const PORT = 8001;
const FRONTEND_ORIGIN = 'http://localhost:5173';

app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// userId (string) -> Set<socketId>
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('Client Connected', socket.id);

  socket.on('register', (userIdRaw) => {
    const userId = String(userIdRaw);
    socket.userId = userId;

    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    userSockets.get(userId).add(socket.id);

    console.log(`🧍 Registered user: ${userId} → ${socket.id}`);
  });

  socket.on('private-message', (payload) => {
    const { toUserId, message, fromUserId, timestamp } = payload || {};
    const fromId = String(fromUserId || '');
    const toId = String(toUserId || '');
    if (!fromId || !toId || typeof message !== 'string' || !message.trim()) return;

    const msg = {
      fromUserId: fromId,
      toUserId: toId,
      message: message.trim(),
      timestamp: timestamp || Date.now(),
    };

    // Echo to all sender sockets (so sender sees their own message on multiple tabs/devices)
    const senderSet = userSockets.get(fromId) || new Set();
    for (const sid of senderSet) {
      io.to(sid).emit('receive_private_message', msg);
    }

    // Deliver to all recipient sockets
    const recipientSet = userSockets.get(toId) || new Set();
    for (const sid of recipientSet) {
      io.to(sid).emit('receive_private_message', msg);
    }
  });

  socket.on('disconnect', () => {
    const { userId } = socket;
    if (userId && userSockets.has(userId)) {
      const set = userSockets.get(userId);
      set.delete(socket.id);
      if (set.size === 0) userSockets.delete(userId);
      console.log(`❌ User disconnected: ${userId}`);
    } else {
      console.log('Socket disconnected:', socket.id);
    }
  });
});

await DBConnection();

app.get('/test', (req, res) => {
  res.send('backend is running');
});

app.use('/api/upload', AutenticateUser, AuthorizeUser(['admin', 'user']), crudOp);
app.use('/api/generate', AdvConcepts);
app.use('/api/user', UserRoutes);
app.use('/api/foods',FoodDetails)

server.listen(PORT, () => {
  console.log(`Port is Running at ${PORT}`);
});
