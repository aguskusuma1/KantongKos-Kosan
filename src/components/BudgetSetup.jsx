import React, { useState } from 'react';
import { Wallet, Calendar, CalendarDays, ArrowLeft } from 'lucide-react';

export default function BudgetSetup({ onSave }) {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState(''); // 'bulanan' or 'mingguan'
  const [amount, setAmount] = useState('');

  const handleSelectMode = (selectedMode) => {
    setMode(selectedMode);
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    
    // Pass the raw amount and the selected mode
    onSave(Number(amount), mode);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', padding: '40px 24px', width: '100%', maxWidth: '400px' }}>
      
      {step === 1 && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ background: 'var(--panel-track-bg)', padding: '16px', borderRadius: '50%' }}>
              <Wallet size={48} color="var(--primary)" />
            </div>
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Selamat Datang!</h2>
          <p style={{ marginBottom: '30px', color: 'var(--text-secondary)' }}>
            Bagaimana Anda ingin mengatur budget Anda?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button 
              onClick={() => handleSelectMode('bulanan')}
              className="btn"
              style={{ 
                background: 'var(--panel-bg)', color: 'var(--text-primary)', 
                border: '1px solid var(--surface-border)', padding: '20px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'
              }}
            >
              <CalendarDays size={32} color="var(--primary)" />
              <div>
                <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>Mode Bulanan</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Atur total budget untuk 1 bulan penuh
                </div>
              </div>
            </button>

            <button 
              onClick={() => handleSelectMode('mingguan')}
              className="btn"
              style={{ 
                background: 'var(--panel-bg)', color: 'var(--text-primary)', 
                border: '1px solid var(--surface-border)', padding: '20px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'
              }}
            >
              <Calendar size={32} color="var(--warning)" />
              <div>
                <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>Mode Mingguan</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Atur budget per minggu (Akan direset tiap Senin)
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <button 
              onClick={() => setStep(1)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <ArrowLeft size={24} />
            </button>
            <h2 style={{ fontSize: '1.5rem', flex: 1, textAlign: 'center', paddingRight: '24px' }}>
              Nominal {mode === 'mingguan' ? 'Mingguan' : 'Bulanan'}
            </h2>
          </div>
          
          <p style={{ marginBottom: '30px', color: 'var(--text-secondary)' }}>
            {mode === 'mingguan' 
              ? 'Berapa jatah budget Anda untuk SATU MINGGU? Jatah harian akan dihitung per minggu dan direset setiap Senin.'
              : 'Berapa total dana yang Anda miliki untuk BULAN INI? Jatah harian dihitung per bulan.'}
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label" style={{ textAlign: 'left' }}>
                Total Budget {mode === 'mingguan' ? 'Per Minggu' : 'Bulan Ini'} (Rp)
              </label>
              <input 
                type="number" 
                className="input-field" 
                placeholder={mode === 'mingguan' ? "Contoh: 350000" : "Contoh: 1500000"}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
              />
            </div>

            {mode === 'mingguan' && amount && (
              <div style={{ background: 'var(--panel-track-bg)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.9rem' }}>
                Budget Anda: <strong>Rp {Number(amount).toLocaleString('id-ID')} / minggu</strong>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
              Mulai Budgeting
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
