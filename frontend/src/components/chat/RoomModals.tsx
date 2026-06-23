import { useState } from 'react';
import { X } from 'lucide-react';

const THEME_COLORS = [
  { name: 'Svetla (Default)', hex: '#ffffff' },
  { name: 'Cink', hex: '#f4f4f5' },
  { name: 'Plava', hex: '#eff6ff' },
  { name: 'Smaragdna', hex: '#ecfdf5' },
  { name: 'Ljubičasta', hex: '#faf5ff' },
  { name: 'Ružičasta', hex: '#fff1f2' },
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
    <div className="fixed inset-0 bg-zinc-950/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md border border-zinc-200 shadow-lg rounded-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
          <h2 className="font-bold text-zinc-900 tracking-tight">Nova Soba</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 transition-colors"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Naziv sobe</label>
            <input 
              type="text" 
              required 
              placeholder="npr. Chat Soba 1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Tema sobe</label>
            <div className="flex gap-2 flex-wrap">
              {THEME_COLORS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setThemeColor(color.hex)}
                  className={`w-8 h-8 rounded-sm border-2 transition-all ${
                    themeColor === color.hex ? 'border-blue-600 scale-110 shadow-sm' : 'border-zinc-200 hover:border-zinc-400'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-3 border border-zinc-200 rounded-sm hover:bg-zinc-50 transition-colors">
            <input 
              type="checkbox" 
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-blue-600"
            />
            <div>
              <div className="text-sm font-semibold text-zinc-900">Privatna soba (1-na-1)</div>
              <div className="text-xs text-zinc-500">Samo osobe sa kodom mogu da pristupe.</div>
            </div>
          </label>

          <button type="submit" className="w-full py-2.5 bg-zinc-900 text-white font-semibold text-sm rounded-sm hover:bg-zinc-800 transition-colors">
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
    <div className="fixed inset-0 bg-zinc-950/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm border border-zinc-200 shadow-lg rounded-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
          <h2 className="font-bold text-zinc-900 tracking-tight">Pridruži se sobi</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Invite Kod</label>
            <input 
              type="text" 
              required 
              placeholder="npr. 123e4567-e89b..."
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors text-sm font-mono"
            />
          </div>
          <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-sm hover:bg-blue-700 transition-colors">
            Pridruži se
          </button>
        </form>
      </div>
    </div>
  );
}