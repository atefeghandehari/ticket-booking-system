import { useState, useEffect } from 'react';
import axios from 'axios';
import { Ticket, LogIn } from 'lucide-react';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [tickets, setTickets] = useState<number | null>(null);
  const [message, setMessage] = useState('');

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
    try {
      const res = await axios.post('http://localhost:5000/api/login', { username });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setMessage('');
    } catch (error) {
      setMessage('Login failed');
    }
  };

  const handleBook = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/book',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      fetchTickets();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Booking failed');
      fetchTickets();
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <LogIn /> System Login
          </h2>
          <input
            type="text"
            placeholder="Username"
            className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Ticket className="text-blue-600" /> Flash Sale
          </h1>
          <button
            onClick={() => {
              setToken(null);
              localStorage.removeItem('token');
            }}
            className="text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg text-center mb-8">
          <p className="text-xl text-gray-600">Available Tickets</p>
          <p className="text-5xl font-bold text-blue-600 my-4">{tickets !== null ? tickets : '...'}</p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 font-medium ${message.includes('Sold out') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <button
          onClick={handleBook}
          disabled={tickets === 0}
          className="w-full bg-blue-600 text-white py-4 rounded-lg text-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}