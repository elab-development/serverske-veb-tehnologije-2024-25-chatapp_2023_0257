import { LogOut, Plus, Hash, Link as LinkIcon } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface SidebarProps {
  rooms: any[];
  activeRoom: any;
  setActiveRoom: (room: any) => void;
  onOpenCreate: () => void;
  onOpenJoin: () => void;
  className?: string;
  onRoomSelectMobile?: () => void;
}

export default function Sidebar({ rooms, activeRoom, setActiveRoom, onOpenCreate, onOpenJoin, className = '', onRoomSelectMobile }: SidebarProps) {
  const { user, logout } = useAuthStore();

  const handleRoomSelect = (room: any) => {
    setActiveRoom(room);
    if (onRoomSelectMobile) onRoomSelectMobile();
  };

  return (
    <div className={`w-72 border-r border-zinc-200 flex flex-col bg-zinc-950 text-zinc-100 shrink-0 h-full ${className}`}>
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
        <div className="flex items-center gap-3">
          {user?.avatarUrl ? (
             <img src={`http://localhost:5000${user.avatarUrl}`} alt="avatar" className="w-8 h-8 rounded-sm object-cover" />
          ) : (
             <div className="w-8 h-8 rounded-sm bg-blue-600 flex items-center justify-center font-bold text-sm">
               {user?.username.charAt(0).toUpperCase()}
             </div>
          )}
          <span className="font-semibold tracking-wide text-sm">{user?.username}</span>
        </div>
        <button onClick={logout} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-sm transition-colors">
          <LogOut size={16} />
        </button>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
          <span>Tvoje Sobe</span>
          <div className="flex gap-1">
             <button onClick={onOpenJoin} className="p-1 hover:text-zinc-300 hover:bg-zinc-800 rounded-sm transition-colors"><LinkIcon size={14} /></button>
             <button onClick={onOpenCreate} className="p-1 hover:text-zinc-300 hover:bg-zinc-800 rounded-sm transition-colors"><Plus size={16} /></button>
          </div>
        </div>
        
        <div className="space-y-1">
          {rooms.map(room => (
            <button
              key={room.id}
              onClick={() => handleRoomSelect(room)}
              className={`w-full text-left px-3 py-2.5 rounded-sm flex items-center text-sm transition-all ${
                activeRoom?.id === room.id ? 'bg-blue-600 text-white font-medium shadow-sm' : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Hash size={16} className={`mr-2 shrink-0 ${activeRoom?.id === room.id ? 'text-blue-200' : 'text-zinc-600'}`} />
              <span className="truncate">{room.name}</span>
              {room.isPrivate && <span className="ml-auto text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded-sm">Privatno</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}