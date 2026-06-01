import { useState, useEffect } from 'react';
import axios from 'axios';
import { Ticket, LogIn, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [tickets, setTickets] = useState<number | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchTickets();
    }
  }, [token]);

  const fetchTickets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tickets');
      setTickets(res.data.available);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/login', { username });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setMessage(null);
    } catch (error) {
      setMessage({ text: 'Authentication failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/book',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ text: res.data.message, type: 'success' });
      fetchTickets();
    } catch (error: any) {
      setMessage({ text: error.response?.data?.message || 'Booking failed', type: 'error' });
      fetchTickets();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setTickets(null);
    setMessage(null);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-500 p-3 rounded-full mb-4 shadow-lg shadow-blue-500/30">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Hamrah Academy</h2>
            <p className="text-slate-300 mt-2 text-sm">Flash Sale Authentication System</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Secure Login'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Concert Flash Sale</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Sign Out
          </button>
        </header>

        <main className="grid gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
            <p className="text-slate-300 font-medium mb-2 uppercase tracking-widest text-sm">Real-time Availability</p>
            <div className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 my-4 drop-shadow-sm">
              {tickets !== null ? tickets : <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto" />}
            </div>
            <p className="text-slate-400 text-sm">Tickets remaining out of 1000</p>
          </div>

          {message && (
            <div className={`p-4 rounded-xl flex items-center gap-3 border backdrop-blur-md ${
              message.type === 'error' 
                ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
              {message.type === 'error' ? <XCircle className="w-5 h-5 shrink-0" /> : <CheckCircle className="w-5 h-5 shrink-0" />}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          <button
            onClick={handleBook}
            disabled={tickets === 0 || loading}
            className="w-full relative group overflow-hidden bg-blue-600 disabled:bg-slate-800 text-white py-5 rounded-2xl text-xl font-bold transition-all hover:bg-blue-500 disabled:cursor-not-allowed shadow-xl shadow-blue-600/20 disabled:shadow-none"
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : tickets === 0 ? (
                'Sold Out'
              ) : (
                'Purchase Ticket Now'
              )}
            </div>
          </button>
        </main>
      </div>
    </div>
  );
}