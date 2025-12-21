import React, { useState } from 'react';
import { RadioTower } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(form.username, form.password);

    if (!result.success) {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card" style={{ width: '400px' }}>
        <div className="flex items-center justify-center mb-8">
          <RadioTower size={48} color="#FF4D4D" />
          <h1 
            className="text-3xl font-bold" 
            style={{ 
              marginLeft: '12px', 
              fontFamily: 'Rajdhani, sans-serif' 
            }}
          >
            KARGU
          </h1>
        </div>
        
        {error && (
          <div 
            className="mb-4 p-3 text-sm"
            style={{ 
              background: 'rgba(255, 77, 77, 0.1)', 
              border: '1px solid #FF4D4D',
              borderRadius: '2px',
              color: '#FF4D4D'
            }}
          >
            {error}
          </div>
        )}
        
        <div>
          <div className="mb-4">
            <label className="block mb-2 text-sm">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              onKeyPress={handleKeyPress}
              className="input-field"
              placeholder="Enter username"
              disabled={loading}
            />
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 text-sm">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyPress={handleKeyPress}
              className="input-field"
              placeholder="Enter password"
              disabled={loading}
            />
          </div>
          
          <button
            onClick={handleLogin}
            className="btn btn-primary w-full py-3"
            style={{ letterSpacing: '1px' }}
            disabled={loading}
          >
            {loading ? 'ACCESSING...' : 'ACCESS SYSTEM'}
          </button>
        </div>
        
        <p className="text-xs mt-4 text-center text-dim">
          Default: admin / admin123
        </p>
      </div>
    </div>
  );
};

export default LoginPage;