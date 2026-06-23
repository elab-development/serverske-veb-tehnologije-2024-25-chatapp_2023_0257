import { Server, Socket } from 'socket.io';

export const setupSockets = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`Klijent povezan: ${socket.id}`);

        socket.on('joinRoom', (data: { roomId: string; username: string }) => {
            const roomId = typeof data === 'object' ? data.roomId : data;
            const username = typeof data === 'object' ? data.username : 'Neko';

            const currentRooms = Array.from(socket.rooms).filter(r => r !== socket.id);
            currentRooms.forEach(room => {
                socket.leave(room);
                console.log(`Socket ${socket.id} napustio sobu ${room}`);
            });

            socket.join(roomId);
            console.log(`Socket ${socket.id} pristupio sobi ${roomId}`);

            socket.to(roomId).emit('userJoinedNotify', {
                content: `Korisnik ${username} se pridružio ćaskanju.`,
                createdAt: new Date().toISOString(),
                isSystem: true,
            });
        });

        socket.on('leaveRoom', (data: { roomId: string }) => {
            socket.leave(data.roomId);
            console.log(`Socket ${socket.id} napustio sobu ${data.roomId}`);
        });

        socket.on('sendMessage', (data: { roomId: string; message: any }) => {
            socket.to(data.roomId).emit('receiveMessage', {
                ...data.message,
                roomId: data.roomId,
            });
        });

        socket.on('deleteMessage', (data: { roomId: string; messageId: number }) => {
            socket.to(data.roomId).emit('messageDeletedNotify', {
                messageId: data.messageId,
                roomId: data.roomId,
            });
        });

        socket.on('typing', (data: { roomId: string; username: string }) => {
            socket.to(data.roomId).emit('userTyping', { username: data.username, roomId: data.roomId });
        });

        socket.on('stopTyping', (data: { roomId: string; username: string }) => {
            socket.to(data.roomId).emit('userStoppedTyping', { username: data.username, roomId: data.roomId });
        });

        socket.on('disconnect', () => {
            console.log(`Klijent diskonektovan: ${socket.id}`);
        });
    });
};