// /client/src/socket.js
import { io } from 'socket.io-client';

// ⚡ Connect to backend socket server
const socket = io('http://localhost:8001');

export default socket;