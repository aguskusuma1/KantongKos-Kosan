import React from 'react';
import { X, Sun, Moon, LogOut, Edit2 } from 'lucide-react';

export default function SettingsModal({ onClose, theme, toggleTheme, onLogout, onChangeBudget }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '350px', padding: '24px', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '1.2rem', marginBottom: '24px', textAlign: 'center' }}>Pengaturan</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Ubah Budget */}
          <button 
            onClick={() => { onClose(); onChangeBudget(); }}
            className="btn"
            style={{ 
              background: 'var(--panel-bg)', color: 'var(--text-primary)', 
              border: '1px solid var(--surface-border)', justifyContent: 'flex-start'
            }}
          >
            <Edit2 size={18} color="var(--primary)" /> Ubah Pengaturan Budget
          </button>

          {/* Tema */}
          <button 
            onClick={toggleTheme}
            className="btn"
            style={{ 
              background: 'var(--panel-bg)', color: 'var(--text-primary)', 
              border: '1px solid var(--surface-border)', justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {theme === 'dark' ? <Moon size={18} color="var(--warning)" /> : <Sun size={18} color="var(--warning)" />} 
              Mode Tema
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {theme === 'dark' ? 'Gelap' : 'Terang'}
            </span>
          </button>

          {/* Logout */}
          <button 
            onClick={onLogout}
            className="btn btn-danger"
            style={{ marginTop: '16px' }}
          >
            <LogOut size={18} /> Keluar Akun
          </button>

        </div>
      </div>
    </div>
  );
}
