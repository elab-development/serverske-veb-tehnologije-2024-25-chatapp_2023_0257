import { LogOut, Plus, Hash, Link as LinkIcon, Lock, Search } from 'lucide-react';
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

export default function Sidebar({
  rooms, activeRoom, setActiveRoom,
  onOpenCreate, onOpenJoin,
  className = '', onRoomSelectMobile,
}: SidebarProps) {
  const { user, logout } = useAuthStore();

  const handleRoomSelect = (room: any) => {
    setActiveRoom(room);
    if (onRoomSelectMobile) onRoomSelectMobile();
  };

  return (
    <div className={`flex flex-col h-full shrink-0 w-72 ${className}`}
      style={{ background: '#111b21' }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ background: '#202c33' }}>
        <div className="flex items-center gap-3">
          {user?.avatarUrl ? (
            <img
              src={`http://localhost:5000${user.avatarUrl}`}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white select-none"
              style={{ background: 'linear-gradient(135deg, #00a884 0%, #0097a7 100%)' }}
            >
              {user?.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold" style={{ color: '#e9edef' }}>
              {user?.username}
            </p>
            <p className="text-[11px]" style={{ color: '#8696a0' }}>Online</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2 rounded-full transition-all hover:brightness-125"
          style={{ color: '#8696a0', background: 'transparent' }}
          title="Odjavi se"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* ── Search bar ── */}
      <div className="px-3 py-2" style={{ background: '#111b21' }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: '#202c33' }}>
          <Search size={14} style={{ color: '#8696a0' }} />
          <input
            type="text"
            placeholder="Pretraži sobe..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: '#e9edef' }}
          />
        </div>
      </div>

      {/* ── Section header ── */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: '#8696a0' }}>
          Sobe
        </span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={onOpenJoin}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors hover:brightness-125"
            style={{ color: '#8696a0' }}
            title="Pridruži se sobi"
          >
            <LinkIcon size={12} />
            <span>Pridruži</span>
          </button>
          <button
            onClick={onOpenCreate}
            className="p-1.5 rounded-md transition-colors hover:brightness-125"
            style={{ color: '#00a884' }}
            title="Nova soba"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* ── Room list ── */}
      <div className="flex-1 overflow-y-auto">
        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 gap-3">
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: '#202c33' }}>
              <Hash size={22} style={{ color: '#8696a0' }} />
            </div>
            <p className="text-sm text-center" style={{ color: '#8696a0' }}>
              Nema soba još uvek
            </p>
            <button
              onClick={onOpenCreate}
              className="text-[13px] font-semibold px-4 py-2 rounded-full transition-opacity hover:opacity-80"
              style={{ color: '#111b21', background: '#00a884' }}
            >
              Napravi prvu
            </button>
          </div>
        ) : (
          rooms.map(room => {
            const isActive = activeRoom?.id === room.id;
            return (
              <button
                key={room.id}
                onClick={() => handleRoomSelect(room)}
                className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left"
                style={{
                  background: isActive ? '#2a3942' : 'transparent',
                  borderLeft: isActive ? '3px solid #00a884' : '3px solid transparent',
                }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-base font-bold"
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, #00a884 0%, #0097a7 100%)'
                      : '#2a3942',
                    color: isActive ? '#fff' : '#8696a0',
                  }}
                >
                  {room.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-sm font-medium truncate"
                      style={{ color: isActive ? '#e9edef' : '#d1d7db' }}
                    >
                      {room.name}
                    </span>
                    {room.isPrivate && (
                      <Lock size={10} style={{ color: '#8696a0', flexShrink: 0 }} />
                    )}
                  </div>
                  <p className="text-[12px] truncate mt-0.5" style={{ color: '#8696a0' }}>
                    Tap to open chat
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}