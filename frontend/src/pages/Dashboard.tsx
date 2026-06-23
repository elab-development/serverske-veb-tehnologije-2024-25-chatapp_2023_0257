import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import Sidebar from '../components/chat/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import { CreateRoomModal, JoinRoomModal } from '../components/chat/RoomModals';

export default function Dashboard() {
    const { token, user } = useAuthStore();
    const [rooms, setRooms] = useState<any[]>([]);
    const [activeRoom, setActiveRoom] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    const socketRef = useRef<Socket | null>(null);
    const activeRoomRef = useRef<any | null>(null);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isJoinOpen, setIsJoinOpen] = useState(false);

    useEffect(() => {
        activeRoomRef.current = activeRoom;
    }, [activeRoom]);

    useEffect(() => {
        socketRef.current = io('http://localhost:5000', { auth: { token } });

        socketRef.current.on('receiveMessage', (msg: any) => {
            if (msg.roomId !== activeRoomRef.current?.id?.toString()) return;
            setMessages((prev) => [...prev, msg]);
        });

        socketRef.current.on('userTyping', (data: { username: string; roomId: string }) => {
            if (data.roomId !== activeRoomRef.current?.id?.toString()) return;
            setTypingUsers(prev => prev.includes(data.username) ? prev : [...prev, data.username]);
        });

        socketRef.current.on('userStoppedTyping', (data: { username: string; roomId: string }) => {
            if (data.roomId !== activeRoomRef.current?.id?.toString()) return;
            setTypingUsers(prev => prev.filter(u => u !== data.username));
        });

        socketRef.current.on('messageDeletedNotify', (data: { messageId: number; roomId: string }) => {
            if (data.roomId !== activeRoomRef.current?.id?.toString()) return;
            setMessages(prev => prev.map(msg =>
                msg.id === data.messageId
                    ? { ...msg, isDeleted: true, content: 'Ova poruka je obrisana.' }
                    : msg
            ));
        });

        socketRef.current.on('userJoinedNotify', (sysMsg: any) => {
            if (sysMsg.roomId && sysMsg.roomId !== activeRoomRef.current?.id?.toString()) return;
            setMessages((prev) => [...prev, { id: Date.now() + Math.random(), ...sysMsg }]);
        });

        return () => { socketRef.current?.disconnect(); };
    }, [token]);

    const fetchRooms = () => {
        api.get('/rooms').then(res => setRooms(res.data)).catch(console.error);
    };

    useEffect(() => { fetchRooms(); }, []);

    useEffect(() => {
        if (!activeRoom) return;

        setTypingUsers([]);
        api.get(`/rooms/${activeRoom.id}/messages`).then(res => {
            setMessages(res.data.reverse());
        });
        socketRef.current?.emit('joinRoom', {
            roomId: activeRoom.id.toString(),
            username: user?.username,
        });

        return () => {
            socketRef.current?.emit('leaveRoom', { roomId: activeRoom.id.toString() });
        };
    }, [activeRoom?.id]);

    const handleSendMessage = async (content: string) => {
        if (!activeRoom) return;

        const tempId = Date.now();
        const optimisticMessage = {
            id: tempId,
            content,
            senderId: user?.id,
            roomId: activeRoom.id.toString(),
            createdAt: new Date().toISOString(),
            sender: { username: user?.username },
            isSending: true,
        };

        setMessages(prev => [...prev, optimisticMessage]);

        try {
            const res = await api.post(`/rooms/${activeRoom.id}/messages`, { content });
            const realMessage = res.data;
            setMessages(prev => prev.map(msg => msg.id === tempId ? realMessage : msg));

            socketRef.current?.emit('sendMessage', {
                roomId: activeRoom.id.toString(),
                message: realMessage,
            });
        } catch (err) {
            console.error('Greška pri slanju', err);
            setMessages(prev => prev.filter(msg => msg.id !== tempId));
            alert('Poruka nije poslata, pokušajte ponovo.');
        }
    };

    const handleDeleteMessage = async (messageId: number) => {
        try {
            await api.delete(`/rooms/messages/${messageId}`);
            setMessages(prev => prev.map(msg =>
                msg.id === messageId
                    ? { ...msg, isDeleted: true, content: 'Ova poruka je obrisana.' }
                    : msg
            ));
            socketRef.current?.emit('deleteMessage', {
                roomId: activeRoom.id.toString(),
                messageId,
            });
        } catch (err) {
            alert('Greška pri brisanju poruke.');
        }
    };

    const handleUpdateTheme = async (themeColor: string) => {
        if (!activeRoom) return;
        try {
            const res = await api.patch(`/rooms/${activeRoom.id}/theme`, { themeColor });
            setActiveRoom((prev: any) => ({ ...prev, themeColor: res.data.themeColor }));
            setRooms(prev => prev.map(r =>
                r.id === activeRoom.id ? { ...r, themeColor: res.data.themeColor } : r
            ));
        } catch (err) {
            alert('Samo kreator može menjati boju sobe.');
        }
    };

    const handleTyping = (isTyping: boolean) => {
        if (!activeRoom || !user) return;
        socketRef.current?.emit(isTyping ? 'typing' : 'stopTyping', {
            roomId: activeRoom.id.toString(),
            username: user.username,
        });
    };

    const handleCreateRoom = async (name: string, isPrivate: boolean, themeColor: string) => {
        try {
            const res = await api.post('/rooms', { name, isPrivate, themeColor });
            setRooms(prev => [res.data, ...prev]);
            setActiveRoom(res.data);
        } catch (err) {
            alert('Greška pri kreiranju sobe');
        }
    };

    const handleJoinRoom = async (inviteCode: string) => {
        try {
            await api.post('/rooms/join', { inviteCode });
            fetchRooms();
            alert('Uspešno ste se pridružili sobi!');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Nevažeći invite kod.');
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-zinc-100 relative">
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 z-20 backdrop-blur-sm transition-opacity"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <Sidebar
                rooms={rooms}
                activeRoom={activeRoom}
                setActiveRoom={setActiveRoom}
                onOpenCreate={() => setIsCreateOpen(true)}
                onOpenJoin={() => setIsJoinOpen(true)}
                className={`absolute md:relative z-30 transition-transform duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
                onRoomSelectMobile={() => setIsMobileMenuOpen(false)}
            />

            <ChatWindow
                activeRoom={activeRoom}
                messages={messages}
                onSendMessage={handleSendMessage}
                onOpenSidebar={() => setIsMobileMenuOpen(true)}
                onDeleteMessage={handleDeleteMessage}
                onUpdateTheme={handleUpdateTheme}
                onTyping={handleTyping}
                typingUsers={typingUsers}
            />

            <CreateRoomModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={handleCreateRoom}
            />
            <JoinRoomModal
                isOpen={isJoinOpen}
                onClose={() => setIsJoinOpen(false)}
                onJoin={handleJoinRoom}
            />
        </div>
    );
}