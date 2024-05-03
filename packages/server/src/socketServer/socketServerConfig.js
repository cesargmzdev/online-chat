// Socket configuration
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import events from '##/socketServer/events.js';

let io;
const socketServerConfig = (port) => {
  io = new Server(port, {
    cors: {
      origin: ['http://localhost:5173', 'https://admin.socket.io'],
      credentials: true
    },
    connectionStateRecovery: true
  });

  io
    ? console.log(`Socket server running on port http://localhost:${port} `)
    : console.error('Error starting socket server');

  instrument(io, {
    auth: false
  });

  io.on('connection', (socket) => {
    console.log('User connected', socket.id, io.engine.clientsCount);
    events(socket);
  });
};

export { socketServerConfig, io };
