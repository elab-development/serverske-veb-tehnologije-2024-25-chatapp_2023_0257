import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import Sidebar from '../components/chat/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import { CreateRoomModal, JoinRoomModal } from '../components/chat/RoomModals'; // NOVO

export default function Dashboard() {
  const { token } = useAuthStore();
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoom, setActiveRoom] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000', { auth: { token } });
    socketRef.current.on('receiveMessage', (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => { socketRef.current?.disconnect(); };
  }, [token]);

  const fetchRooms = () => {
    api.get('/rooms').then(res => setRooms(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (activeRoom) {
      api.get(`/rooms/${activeRoom.id}/messages`).then(res => {
        setMessages(res.data.reverse());
      });
      socketRef.current?.emit('joinRoom', activeRoom.id.toString());
    }
  }, [activeRoom]);

  const handleSendMessage = async (content: string) => {
    if (!activeRoom) return;
    try {
      const res = await api.post(`/rooms/${activeRoom.id}/messages`, { content });
      setMessages(prev => [...prev, res.data]);
      socketRef.current?.emit('sendMessage', { roomId: activeRoom.id.toString(), message: res.data });
    } catch (err) {
      console.error('Greška pri slanju', err);
    }
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
    <div className="flex h-screen overflow-hidden bg-zinc-100">
      <Sidebar 
        rooms={rooms} 
        activeRoom={activeRoom} 
        setActiveRoom={setActiveRoom} 
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenJoin={() => setIsJoinOpen(true)}
      />
      <ChatWindow 
        activeRoom={activeRoom} 
        messages={messages} 
        onSendMessage={handleSendMessage} 
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