import { Server, Socket } from 'socket.io';

export const setupSockets = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`Klijent povezan: ${socket.id}`);

        socket.on('joinRoom', (roomId: string) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} pristupio sobi ${roomId}`);
        });

        socket.on('sendMessage', (data: { roomId: string; message: any }) => {
            socket.to(data.roomId).emit('receiveMessage', data.message);
        });

        socket.on('disconnect', () => {
            console.log(`Klijent diskonektovan: ${socket.id}`);
        });
    });
};