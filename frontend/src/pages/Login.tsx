import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

export default function Login() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      const { user, token } = res.data;
      
      loginStore(user, token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Pogrešni kredencijali');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 text-zinc-900 font-sans">
      <div className="w-full max-w-sm p-8 bg-white border border-zinc-300 shadow-sm rounded-sm">
        <h2 className="text-2xl font-bold mb-6 tracking-tight text-zinc-950">Prijava</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm border border-red-200 rounded-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Email</label>
            <input 
              type="email" 
              required 
              className="w-full p-2.5 border border-zinc-300 rounded-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Lozinka</label>
            <input 
              type="password" 
              required 
              className="w-full p-2.5 border border-zinc-300 rounded-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-sm hover:bg-blue-700 transition-colors mt-2"
          >
            Prijavi se
          </button>
        </form>
        
        <p className="mt-5 text-sm text-zinc-600 text-center">
          Nemaš nalog? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Registruj se</Link>
        </p>
      </div>
    </div>
  );
}