import { useRef, useEffect, useState } from 'react';
import { Send, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface ChatWindowProps {
  activeRoom: any;
  messages: any[];
  onSendMessage: (content: string) => void;
  onOpenSidebar: () => void; 
}

export default function ChatWindow({ activeRoom, messages, onSendMessage, onOpenSidebar }: ChatWindowProps) {
  const { user } = useAuthStore();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage('');
  };

  if (!activeRoom) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50 text-zinc-400 font-medium relative">
        <div className="absolute top-4 left-4 md:hidden">
          <button onClick={onOpenSidebar} className="p-2 bg-white border border-zinc-200 rounded-sm text-zinc-900 shadow-sm">
            <Menu size={20} />
          </button>
        </div>
        Izaberite sobu iz menija da biste započeli razgovor.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white w-full">
      <div className="p-4 border-b border-zinc-200 flex justify-start items-center bg-white shadow-sm z-10 gap-3">
        <button onClick={onOpenSidebar} className="md:hidden p-1 text-zinc-500 hover:text-zinc-900 transition-colors">
          <Menu size={24} />
        </button>
        
        <div>
          <h3 className="font-bold text-zinc-900 text-lg flex items-center gap-2">
            <span className="text-zinc-400">#</span> {activeRoom.name}
          </h3>
          <span className="text-xs text-zinc-500 font-medium">Invite kod: <span className="text-zinc-800">{activeRoom.inviteCode}</span></span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5" style={{ backgroundColor: activeRoom.themeColor !== '#ffffff' ? activeRoom.themeColor : '#fafafa' }}>
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[65%] px-4 py-2.5 text-sm rounded-sm shadow-sm ${
                isMe ? 'bg-blue-600 text-white' : 'bg-white border border-zinc-200 text-zinc-900'
              }`}>
                {!isMe && <div className="text-xs font-bold mb-1 text-blue-600">{msg.sender.username}</div>}
                <div className="leading-relaxed wrap-words">{msg.content}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 md:p-4 bg-white border-t border-zinc-200">
        <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Pišite u #${activeRoom.name}...`}
            className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-zinc-100 border border-transparent rounded-sm focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
          />
          <button type="submit" disabled={!newMessage.trim()} className="px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}