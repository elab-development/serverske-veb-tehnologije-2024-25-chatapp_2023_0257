import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import Sidebar from '../components/chat/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';

export default function Dashboard() {
  const { token } = useAuthStore();
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoom, setActiveRoom] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000', { auth: { token } });

    socketRef.current.on('receiveMessage', (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => { socketRef.current?.disconnect(); };
  }, [token]);

  useEffect(() => {
    api.get('/rooms').then(res => setRooms(res.data)).catch(console.error);
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
      
      socketRef.current?.emit('sendMessage', { 
        roomId: activeRoom.id.toString(), 
        message: res.data 
      });
    } catch (err) {
      console.error('Greška pri slanju', err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        rooms={rooms} 
        activeRoom={activeRoom} 
        setActiveRoom={setActiveRoom} 
      />
      <ChatWindow 
        activeRoom={activeRoom} 
        messages={messages} 
        onSendMessage={handleSendMessage} 
      />
    </div>
  );
}