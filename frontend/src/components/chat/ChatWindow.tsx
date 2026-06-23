import { useRef, useEffect, useState } from 'react';
import { Send, Menu, MoreVertical, Trash2, Image, ArrowDown } from 'lucide-react'; // Dodata ArrowDown ikonica
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';

interface ChatWindowProps {
    activeRoom: any;
    messages: any[];
    onSendMessage: (content: string) => void;
    onOpenSidebar: () => void;
    onDeleteMessage: (id: number) => void;
    onUpdateTheme: (hex: string) => void;
    onTyping: (isTyping: boolean) => void;
    typingUsers: string[];
}

const THEME_COLORS = [
    { name: 'Default', hex: '#0b141a' },
    { name: 'Tamnoplava', hex: '#0d1b2a' },
    { name: 'Tamnozelena', hex: '#0a1f14' },
    { name: 'Tamnoljubičasta', hex: '#16101f' },
    { name: 'Tamnocrvena', hex: '#1f0d0d' },
    { name: 'Antracit', hex: '#151515' },
];

export default function ChatWindow({ activeRoom, messages, onSendMessage, onOpenSidebar, onDeleteMessage, onUpdateTheme, onTyping, typingUsers }: ChatWindowProps) {
    const { user } = useAuthStore();
    const [newMessage, setNewMessage] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [isGifOpen, setIsGifOpen] = useState(false);
    const [gifQuery, setGifQuery] = useState('six seven');
    const [gifs, setGifs] = useState<any[]>([]);

    const [unreadCount, setUnreadCount] = useState(0);
    const [isNearBottom, setIsNearBottom] = useState(true);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollPosition = container.scrollTop + container.clientHeight;
        const totalHeight = container.scrollHeight;

        const nearBottom = totalHeight - scrollPosition < 150;
        setIsNearBottom(nearBottom);

        if (nearBottom) {
            setUnreadCount(0);
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        if (isNearBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            setUnreadCount(0);
        } else {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && lastMessage.senderId !== user?.id && !lastMessage.isSystem) {
                setUnreadCount((prev) => prev + 1);
            }
        }
    }, [messages]);

    useEffect(() => {
        setUnreadCount(0);
        setIsNearBottom(true);
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        }, 50);
    }, [activeRoom]);

    const fetchGifs = async () => {
        if (!gifQuery.trim()) return;
        try {
            const res = await api.get(`/rooms/gifs?q=${gifQuery}`);
            if (res.data && res.data.data) {
                setGifs(res.data.data);
            }
        } catch (err) {
            console.error("Greška pri povlačenju GIF-ova", err);
        }
    };

    const handleGifSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchGifs();
    };

    const handleSelectGif = (gifUrl: string) => {
        onSendMessage(gifUrl);
        setIsGifOpen(false);
        setGifs([]);
        setGifQuery('');
        setIsNearBottom(true);
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        onTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            onTyping(false);
        }, 1500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        onSendMessage(newMessage);
        setNewMessage('');
        onTyping(false);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        setIsNearBottom(true);
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
    };

    const handleScrollToBottomClick = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        setUnreadCount(0);
        setIsNearBottom(true);
    };

    if (!activeRoom) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center relative" style={{ background: '#0b141a' }}>
                <button onClick={onOpenSidebar} className="absolute top-4 left-4 md:hidden p-2 rounded-sm shadow-sm" style={{ background: '#202c33', color: '#aebac1' }}>
                    <Menu size={20} />
                </button>
                <div className="flex flex-col items-center gap-4 px-8 text-center max-w-sm">
                    <div className="w-20 h-20 rounded-sm flex items-center justify-center" style={{ background: '#202c33' }}>
                        <Send size={32} style={{ color: '#00a884' }} />
                    </div>
                    <p className="text-lg font-semibold" style={{ color: '#e9edef' }}>Dobrodošli</p>
                    <p className="text-sm" style={{ color: '#8696a0' }}>Izaberite sobu iz menija da biste započeli razgovor.</p>
                </div>
            </div>
        );
    }

    const formatTime = (ts: string) => {
        if (!ts) return '';
        return new Date(ts).toLocaleTimeString('sr', { hour: '2-digit', minute: '2-digit' });
    };
    return (
        <div className="flex-1 flex flex-col w-full relative" style={{ background: '#0b141a' }}>

            <div className="flex items-center gap-3 px-4 py-3 z-10" style={{ background: '#202c33', borderBottom: '1px solid #2a3942' }}>
                <button onClick={onOpenSidebar} className="md:hidden p-1 rounded-sm mr-1 transition-colors" style={{ color: '#aebac1' }}>
                    <Menu size={22} />
                </button>

                <div className="w-10 h-10 rounded-sm flex items-center justify-center font-bold text-sm shrink-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #00a884 0%, #0097a7 100%)', color: '#fff' }}>
                    {activeRoom.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#e9edef' }}>
                        {activeRoom.name}
                    </p>
                    <p className="text-[11px] truncate" style={{ color: '#8696a0' }}>
                        {typingUsers.length > 0 ? `${typingUsers.join(', ')} kucka...` : `Invite: ${activeRoom.inviteCode}`}
                    </p>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-sm transition-colors hover:brightness-125"
                        style={{ color: '#aebac1', background: isMenuOpen ? '#2a3942' : 'transparent' }}
                    >
                        <MoreVertical size={20} />
                    </button>

                    {isMenuOpen && user?.id === activeRoom.creatorId && (
                        <div className="absolute right-0 mt-2 w-56 rounded-sm shadow-xl z-50 border" style={{ background: '#202c33', border: '1px solid #2a3942' }}>
                            <div className="px-4 py-3 border-b" style={{ borderColor: '#2a3942' }}>
                                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8696a0' }}>Boja Pozadine</p>
                            </div>
                            <div className="p-3 grid grid-cols-3 gap-2">
                                {THEME_COLORS.map(color => (
                                    <button
                                        key={color.hex}
                                        onClick={() => { onUpdateTheme(color.hex); setIsMenuOpen(false); }}
                                        className="w-full aspect-square rounded-sm transition-transform hover:scale-110 border-2"
                                        style={{
                                            background: color.hex,
                                            borderColor: activeRoom.themeColor === color.hex ? '#00a884' : '#3b4a54'
                                        }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-2 relative"
                style={{ background: activeRoom?.themeColor && activeRoom.themeColor !== '#ffffff' ? activeRoom.themeColor : '#0b141a' }}            >
                {messages.map((msg, idx) => {
                    if (msg.isSystem) {
                        return (
                            <div key={msg.id} className="flex justify-center my-2">
                                <div className="text-[11px] px-3 py-1 rounded-sm tracking-wide shadow-sm font-medium" style={{ background: '#182229', color: '#8696a0', border: '1px solid #2a3942' }}>
                                    {msg.content}
                                </div>
                            </div>
                        );
                    }

                    const isMe = msg.senderId === user?.id;
                    const prevMsg = messages[idx - 1];
                    const showSender = !isMe && (!prevMsg || prevMsg.senderId !== msg.senderId);

                    const isGif = msg.content.includes('giphy.com') || msg.content.match(/\.(jpeg|jpg|gif|png)$/) != null;

                    return (
                        <div key={msg.id} className={`flex group ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {isMe && !msg.isDeleted && (
                                <button
                                    onClick={() => onDeleteMessage(msg.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 mr-1 transition-opacity text-red-500 hover:text-red-400 flex items-center"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}

                            <div className="max-w-[75%] md:max-w-[55%] px-3 py-2 rounded-md text-sm shadow-sm"
                                style={{
                                    background: isMe ? '#005c4b' : '#202c33',
                                    color: msg.isDeleted ? '#8696a0' : '#e9edef',
                                    fontStyle: msg.isDeleted ? 'italic' : 'normal',
                                    border: '1px solid #2a3942'
                                }}
                            >
                                {showSender && (
                                    <p className="text-xs font-semibold mb-1" style={{ color: '#00a884' }}>
                                        {msg.sender?.username}
                                    </p>
                                )}

                                {!msg.isDeleted && isGif ? (
                                    <img src={msg.content} alt="gif-content" className="max-w-full rounded-sm max-h-48 object-contain mt-1" />
                                ) : (
                                    <p className="leading-relaxed break-words">{msg.content}</p>
                                )}

                                <p className="text-[10px] mt-1 text-right" style={{ color: '#8696a0' }}>
                                    {formatTime(msg.createdAt)}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {unreadCount > 0 && (
                <button
                    onClick={handleScrollToBottomClick}
                    className="absolute bottom-20 right-6 z-40 flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase border shadow-2xl transition-all hover:brightness-110 animate-bounce rounded-sm"
                    style={{ background: '#00a884', color: '#fff', borderColor: '#00c49a' }}
                >
                    <ArrowDown size={14} />
                    <span>Nova poruka ({unreadCount})</span>
                </button>
            )}

            {isGifOpen && (
                <div className="p-3 border-t flex flex-col gap-2 z-20 transition-all shadow-inner" style={{ background: '#1f2c34', borderColor: '#2a3942' }}>
                    <form onSubmit={handleGifSearchSubmit} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Pretraži Giphy..."
                            value={gifQuery}
                            onChange={(e) => setGifQuery(e.target.value)}
                            className="flex-1 px-3 py-1.5 text-xs rounded-sm outline-none"
                            style={{ background: '#2a3942', color: '#e9edef', border: '1px solid #3b4a54' }}
                        />
                        <button type="submit" className="text-xs px-3 py-1.5 rounded-sm font-semibold text-white" style={{ background: '#00a884' }}>
                            Traži
                        </button>
                    </form>
                    <div className="flex gap-2 overflow-x-auto py-1 max-w-full shrink-0 scrollbar-thin">
                        {gifs.length > 0 ? (
                            gifs.map(g => (
                                <img
                                    key={g.id}
                                    src={g.images.fixed_height_small.url}
                                    alt="giphy-preview"
                                    onClick={() => handleSelectGif(g.images.fixed_height.url)}
                                    className="h-20 rounded-sm cursor-pointer border border-transparent hover:border-teal-400 object-cover transition-all shrink-0"
                                />
                            ))
                        ) : (
                            <p className="text-[11px] text-zinc-400 py-2">Ukućaj termin i pritisni Traži...</p>
                        )}
                    </div>
                </div>
            )}

            <div className="px-3 py-3" style={{ background: '#202c33' }}>
                <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-4xl mx-auto">
                    <button
                        type="button"
                        onClick={() => {
                            setIsGifOpen(!isGifOpen)
                            fetchGifs()
                        }}
                        className="p-2 rounded-sm transition-colors hover:bg-zinc-700"
                        style={{ color: isGifOpen ? '#00a884' : '#aebac1' }}
                        title="Pošalji GIF"
                    >
                        <Image size={20} />
                    </button>

                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleInputChange}
                        placeholder={`Poruka u #${activeRoom.name}`}
                        className="flex-1 px-4 py-2.5 text-sm rounded-sm outline-none transition-colors"
                        style={{ background: '#2a3942', color: '#e9edef', border: '1px solid transparent' }}
                        onFocus={(e) => e.target.style.borderColor = '#00a884'}
                        onBlur={(e) => e.target.style.borderColor = 'transparent'}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="w-11 h-11 flex items-center justify-center rounded-sm transition-all disabled:opacity-40"
                        style={{ background: newMessage.trim() ? 'linear-gradient(135deg, #00a884 0%, #0097a7 100%)' : '#2a3942', color: '#fff' }}
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}