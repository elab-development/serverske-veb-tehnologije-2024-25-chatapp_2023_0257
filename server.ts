import http from 'http';
import app from './app';
import { Server } from 'socket.io';
import { ENV } from './config/env';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`[Socket] Povezao se klijent: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket] Diskonektovao se klijent: ${socket.id}`);
  });
});

server.listen(ENV.PORT, () => {
  console.log(`HTTP Server radi na: http://localhost:${ENV.PORT}`);
  console.log(`WebSocket aktivan na istom portu`);
});