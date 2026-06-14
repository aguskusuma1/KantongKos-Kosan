import React from 'react';
import { Target, PenTool, PieChart, ArrowRight } from 'lucide-react';

export default function LandingPage({ onStart }) {
  return (
    <div className="animate-fade-in" style={{ width: '100%', padding: '20px 0' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '800', 
          background: 'linear-gradient(to right, #60a5fa, #3b82f6, #10b981)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px'
        }}>
          KantongKos-Kosan
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
          Auto-Budgeting Tanpa Ribet. Kendalikan pengeluaran harianmu dengan mudah dan capai target menabung bulan ini!
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '12px', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
            <Target size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Target Saldo Aman</h3>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>Tentukan budget bulanan, dan sistem akan menghitung jatah aman harianmu secara otomatis.</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '12px', borderRadius: 'var(--radius-md)', color: 'var(--warning)' }}>
            <PenTool size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Catat Jajan Cepat</h3>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>Catat setiap pengeluaran jajan atau makan hanya dengan beberapa klik tanpa form rumit.</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: 'var(--radius-md)', color: 'var(--success)' }}>
            <PieChart size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Meteran Visual</h3>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>Pantau sisa kuota hari ini lewat meteran warna-warni yang jadi alarm pengingat otomatis.</p>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={onStart} 
          className="btn btn-primary" 
          style={{ padding: '16px 32px', fontSize: '1.1rem', maxWidth: '300px', margin: '0 auto' }}
        >
          Mulai Gunakan Sekarang <ArrowRight size={20} />
        </button>
        <p style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Gratis, tidak butuh data pribadi rumit.
        </p>
      </div>
    </div>
  );
}
