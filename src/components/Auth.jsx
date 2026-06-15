import React, { useState } from 'react';
import { api } from '../lib/api';
import { LogIn, UserPlus, Lock, Mail } from 'lucide-react';

export default function Auth({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!email || !password) {
      setErrorMessage('Email dan Password wajib diisi!');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setErrorMessage('Password dan Konfirmasi Password tidak sama!');
      return;
    }
    
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.fetch('login', {
          method: 'POST',
          body: { email, password }
        });
        localStorage.setItem('ab_user_id', res.user.id);
        if(onLoginSuccess) onLoginSuccess(res.user);
      } else {
        const res = await api.fetch('register', {
          method: 'POST',
          body: { email, password }
        });
        setSuccessMessage('Registrasi berhasil! Silakan login.');
        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      if (error.message.includes('Failed to fetch')) {
        setErrorMessage('Gagal terhubung ke server. Pastikan internet Anda stabil atau tunggu server selesai update.');
      } else {
        setErrorMessage(error.message);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', margin: '0 auto', padding: '40px 24px' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', background: 'linear-gradient(to right, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {isLogin ? 'Auto-Budgeting' : 'Buat Akun Baru'}
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {isLogin ? 'Masuk untuk melanjutkan' : 'Daftar untuk mengontrol keuanganmu'}
        </p>
      </header>

      {errorMessage && (
        <div style={{ padding: '12px', marginBottom: '20px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div style={{ padding: '12px', marginBottom: '20px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleAuth}>
        <div className="input-group">
          <label className="input-label" style={{ textAlign: 'left' }}>Email</label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', top: '15px', left: '16px', color: 'var(--text-secondary)' }} />
            <input 
              type="email" 
              className="input-field" 
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingLeft: '44px' }}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" style={{ textAlign: 'left' }}>Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', top: '15px', left: '16px', color: 'var(--text-secondary)' }} />
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: '44px' }}
              required
            />
          </div>
        </div>

        {!isLogin && (
          <div className="input-group">
            <label className="input-label" style={{ textAlign: 'left' }}>Konfirmasi Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', top: '15px', left: '16px', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingLeft: '44px' }}
                required={!isLogin}
              />
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }} disabled={loading}>
          {loading ? 'Memproses...' : (isLogin ? <><LogIn size={20}/> Masuk</> : <><UserPlus size={20}/> Daftar</>)}
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button 
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setErrorMessage('');
            setSuccessMessage('');
          }} 
          style={{ 
            background: 'none', border: 'none', color: 'var(--text-secondary)', 
            fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' 
          }}
        >
          {isLogin ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Masuk di sini'}
        </button>
      </div>
    </div>
  );
}
