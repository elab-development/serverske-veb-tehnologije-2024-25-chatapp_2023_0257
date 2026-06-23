import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', formData);
      const userId = res.data.userId;

      if (file) {
        const loginRes = await api.post('/auth/login', { email: formData.email, password: formData.password });
        const token = loginRes.data.token;

        const uploadData = new FormData();
        uploadData.append('avatar', file);

        await api.post('/users/avatar', uploadData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}` 
          }
        });
      }
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Greška pri registraciji');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-neutral-900 font-sans">
      <div className="w-full max-w-md p-8 bg-white border border-neutral-200 rounded-sm shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 tracking-tight">Kreiraj nalog</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm border border-red-200 rounded-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Korisničko ime</label>
            <input 
              type="text" 
              required 
              className="w-full p-2 border border-neutral-300 rounded-sm focus:outline-none focus:border-neutral-500 transition-colors"
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              required 
              className="w-full p-2 border border-neutral-300 rounded-sm focus:outline-none focus:border-neutral-500 transition-colors"
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lozinka</label>
            <input 
              type="password" 
              required 
              className="w-full p-2 border border-neutral-300 rounded-sm focus:outline-none focus:border-neutral-500 transition-colors"
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Avatar (opciono)</label>
            <input 
              type="file" 
              accept="image/*"
              className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-neutral-900 text-white rounded-sm hover:bg-neutral-800 transition-colors text-sm font-medium">
            Registruj se
          </button>
        </form>
        <p className="mt-4 text-sm text-neutral-600 text-center">
          Imaš nalog? <Link to="/login" className="text-neutral-900 font-medium hover:underline">Prijavi se</Link>
        </p>
      </div>
    </div>
  );
}