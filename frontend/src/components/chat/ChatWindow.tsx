import { useRef, useEffect, useState } from 'react';
import { Send, Menu, MoreVertical } from 'lucide-react';
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
            <div
                className="flex-1 flex flex-col items-center justify-center relative"
                style={{ background: '#0b141a' }}
            >
                <button
                    onClick={onOpenSidebar}
                    className="absolute top-4 left-4 md:hidden p-2 rounded-full"
                    style={{ background: '#202c33', color: '#aebac1' }}
                >
                    <Menu size={20} />
                </button>
                <div className="flex flex-col items-center gap-4 px-8 text-center max-w-sm">
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center"
                        style={{ background: '#202c33' }}
                    >
                        <Send size={32} style={{ color: '#00a884' }} />
                    </div>
                    <p className="text-lg font-semibold" style={{ color: '#e9edef' }}>
                        Dobrodošli
                    </p>
                    <p className="text-sm" style={{ color: '#8696a0' }}>
                        Izaberite sobu iz menija da biste započeli razgovor.
                    </p>
                </div>
            </div>
        );
    }

    const formatTime = (ts: string) => {
        if (!ts) return '';
        const d = new Date(ts);
        return d.toLocaleTimeString('sr', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex-1 flex flex-col w-full" style={{ background: '#0b141a' }}>

            <div
                className="flex items-center gap-3 px-4 py-3 z-10"
                style={{ background: '#202c33', borderBottom: '1px solid #2a3942' }}
            >
                <button
                    onClick={onOpenSidebar}
                    className="md:hidden p-1 rounded-full mr-1"
                    style={{ color: '#aebac1' }}
                >
                    <Menu size={22} />
                </button>

                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                    style={{ background: 'linear-gradient(135deg, #00a884 0%, #0097a7 100%)', color: '#fff' }}
                >
                    {activeRoom.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#e9edef' }}>
                        {activeRoom.name}
                    </p>
                    <p className="text-[11px]" style={{ color: '#8696a0' }}>
                        Invite: <span style={{ color: '#aebac1' }}>{activeRoom.inviteCode}</span>
                    </p>
                </div>

                <div className="flex items-center gap-1">
                    {[MoreVertical].map((Icon, i) => (
                        <button
                            key={i}
                            className="p-2 rounded-full transition-colors hover:brightness-125"
                            style={{ color: '#aebac1' }}
                        >
                            <Icon size={20} />
                        </button>
                    ))}
                </div>
            </div>

            <div
                className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
                style={{
                    background: activeRoom.themeColor && activeRoom.themeColor !== '#ffffff'
                        ? activeRoom.themeColor
                        : '#0b141a',
                }}
            >
                {messages.map((msg, idx) => {
                    const isMe = msg.senderId === user?.id;
                    const prevMsg = messages[idx - 1];
                    const showSender = !isMe && (!prevMsg || prevMsg.senderId !== msg.senderId);

                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className="max-w-[75%] md:max-w-[55%] px-3 py-2 rounded-lg text-sm shadow-sm"
                                style={{
                                    background: isMe ? '#005c4b' : '#202c33',
                                    color: '#e9edef',
                                    borderRadius: isMe
                                        ? '12px 12px 2px 12px'
                                        : '12px 12px 12px 2px',
                                }}
                            >
                                {showSender && (
                                    <p className="text-xs font-semibold mb-1" style={{ color: '#00a884' }}>
                                        {msg.sender?.username}
                                    </p>
                                )}
                                <p className="leading-relaxed wrap-words">{msg.content}</p>
                                <p
                                    className="text-[10px] mt-1 text-right"
                                    style={{ color: '#8696a0' }}
                                >
                                    {formatTime(msg.createdAt)}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="px-3 py-3" style={{ background: '#202c33' }}>
                <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Poruka u #${activeRoom.name}`}
                        className="flex-1 px-4 py-2.5 text-sm rounded-lg outline-none"
                        style={{
                            background: '#2a3942',
                            color: '#e9edef',
                            border: 'none',
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="w-10 h-10 flex items-center justify-center rounded-full transition-all disabled:opacity-40"
                        style={{
                            background: newMessage.trim()
                                ? 'linear-gradient(135deg, #00a884 0%, #0097a7 100%)'
                                : '#2a3942',
                            color: '#fff',
                        }}
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}