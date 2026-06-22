import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app';
import { Server } from 'socket.io';
import { ENV } from './config/env';
import { setupSockets } from './sockets/socketHandler';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

setupSockets(io);

server.listen(ENV.PORT, () => {
  console.log(`HTTP Server radi na: http://localhost:${ENV.PORT}`);
  console.log(`WebSocket aktivan na istom portu`);
});