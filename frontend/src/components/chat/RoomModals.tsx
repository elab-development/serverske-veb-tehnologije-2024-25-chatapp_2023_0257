import { useState } from 'react';
import { X, Hash, Lock, Link as LinkIcon } from 'lucide-react';

const THEME_COLORS = [
  { name: 'Default', hex: '#0b141a' },
  { name: 'Tamnoplava', hex: '#0d1b2a' },
  { name: 'Tamnozelena', hex: '#0a1f14' },
  { name: 'Tamnoljubičasta', hex: '#16101f' },
  { name: 'Tamnocrvena', hex: '#1f0d0d' },
  { name: 'Antracit', hex: '#151515' },
];

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, isPrivate: boolean, themeColor: string) => void;
}

export function CreateRoomModal({ isOpen, onClose, onCreate }: CreateRoomModalProps) {
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [themeColor, setThemeColor] = useState(THEME_COLORS[0].hex);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name, isPrivate, themeColor);
    setName('');
    setIsPrivate(false);
    setThemeColor(THEME_COLORS[0].hex);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-xl overflow-hidden shadow-2xl"
        style={{ background: '#202c33' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ background: '#2a3942', borderBottom: '1px solid #3b4a54' }}
        >
          <div className="flex items-center gap-2">
            <Hash size={16} style={{ color: '#00a884' }} />
            <h2 className="font-semibold text-sm" style={{ color: '#e9edef' }}>Nova Soba</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full transition-colors hover:brightness-125"
            style={{ color: '#aebac1', background: '#3b4a54' }}
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-5">
          {/* Name input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: '#8696a0' }}>
              Naziv sobe
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
              style={{ background: '#2a3942', border: '1px solid #3b4a54' }}>
              <Hash size={14} style={{ color: '#8696a0' }} />
              <input
                type="text"
                required
                placeholder="npr. Opšta diskusija"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: '#e9edef' }}
              />
            </div>
          </div>

          {/* Theme picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2.5"
              style={{ color: '#8696a0' }}>
              Tema sobe
            </label>
            <div className="flex gap-2 flex-wrap">
              {THEME_COLORS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setThemeColor(color.hex)}
                  className="w-8 h-8 rounded-full transition-all"
                  style={{
                    background: color.hex,
                    border: themeColor === color.hex
                      ? '2.5px solid #00a884'
                      : '2.5px solid #3b4a54',
                    transform: themeColor === color.hex ? 'scale(1.15)' : 'scale(1)',
                    boxShadow: themeColor === color.hex ? '0 0 0 2px #00a88433' : 'none',
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Private toggle */}
          <button
            type="button"
            onClick={() => setIsPrivate(!isPrivate)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left"
            style={{
              background: isPrivate ? '#0d2e24' : '#2a3942',
              border: `1px solid ${isPrivate ? '#00a884' : '#3b4a54'}`,
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: isPrivate ? '#00a88433' : '#3b4a54' }}
            >
              <Lock size={14} style={{ color: isPrivate ? '#00a884' : '#8696a0' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: '#e9edef' }}>Privatna soba</p>
              <p className="text-[12px]" style={{ color: '#8696a0' }}>
                Pristup samo putem invite koda
              </p>
            </div>
            {/* Custom toggle */}
            <div
              className="w-10 h-5 rounded-full transition-all relative"
              style={{ background: isPrivate ? '#00a884' : '#3b4a54' }}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                style={{
                  background: '#fff',
                  left: isPrivate ? '22px' : '2px',
                }}
              />
            </div>
          </button>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #00a884 0%, #0097a7 100%)',
              color: '#fff',
            }}
          >
            Kreiraj Sobu
          </button>
        </form>
      </div>
    </div>
  );
}


interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (inviteCode: string) => void;
}

export function JoinRoomModal({ isOpen, onClose, onJoin }: JoinRoomModalProps) {
  const [inviteCode, setInviteCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    onJoin(inviteCode);
    setInviteCode('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-sm rounded-xl overflow-hidden shadow-2xl"
        style={{ background: '#202c33' }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ background: '#2a3942', borderBottom: '1px solid #3b4a54' }}
        >
          <div className="flex items-center gap-2">
            <LinkIcon size={15} style={{ color: '#00a884' }} />
            <h2 className="font-semibold text-sm" style={{ color: '#e9edef' }}>Pridruži se sobi</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full"
            style={{ color: '#aebac1', background: '#3b4a54' }}
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: '#8696a0' }}>
              Invite Kod
            </label>
            <input
              type="text"
              required
              placeholder="Zalepi kod ovde..."
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-mono outline-none"
              style={{
                background: '#2a3942',
                color: '#e9edef',
                border: '1px solid #3b4a54',
              }}
            />
            <p className="text-[11px] mt-1.5" style={{ color: '#8696a0' }}>
              Kod dobijaš od vlasnika sobe ili iz podešavanja sobe.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #00a884 0%, #0097a7 100%)',
              color: '#fff',
            }}
          >
            Pridruži se
          </button>
        </form>
      </div>
    </div>
  );
}