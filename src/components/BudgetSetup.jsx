import React, { useState } from 'react';
import { Wallet } from 'lucide-react';

export default function BudgetSetup({ onSave }) {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.updateDefault?.(); // if e is a synthetic event but we shouldn't use updateDefault, use preventDefault
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    onSave(Number(amount));
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '16px', borderRadius: '50%' }}>
          <Wallet size={48} color="var(--primary)" />
        </div>
      </div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Selamat Datang!</h2>
      <p style={{ marginBottom: '30px' }}>
        Berapa total dana yang Anda miliki untuk bulan ini? Kami akan membaginya secara otomatis.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label" style={{ textAlign: 'left' }}>Total Budget Bulan Ini (Rp)</label>
          <input 
            type="number" 
            className="input-field" 
            placeholder="Contoh: 1500000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
          Mulai Budgeting
        </button>
      </form>
    </div>
  );
}
