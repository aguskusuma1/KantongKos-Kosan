import React from 'react';
import { X, Sun, Moon, LogOut, Edit2, Eye, Type, Volume2, VolumeX } from 'lucide-react';

export default function SettingsModal({ 
  onClose, theme, toggleTheme, onLogout, onChangeBudget,
  fontSize, setFontSize, voiceNarrator, setVoiceNarrator
}) {
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
          aria-label="Tutup Pengaturan"
        >
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '1.2rem', marginBottom: '24px', textAlign: 'center' }}>Pengaturan & Aksesibilitas</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Ubah Budget */}
          <button 
            onClick={() => { onClose(); onChangeBudget(); }}
            className="btn"
            style={{ 
              background: 'var(--panel-bg)', color: 'var(--text-primary)', 
              border: '1px solid var(--surface-border)', justifyContent: 'flex-start'
            }}
            aria-label="Ubah Pengaturan Budget harian atau mingguan"
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
            aria-label={`Ubah Tema. Tema saat ini: ${theme === 'dark' ? 'Gelap' : theme === 'light' ? 'Terang' : 'Kontras Tinggi'}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {theme === 'dark' && <Moon size={18} color="var(--warning)" />} 
              {theme === 'light' && <Sun size={18} color="var(--warning)" />} 
              {theme === 'high-contrast' && <Eye size={18} color="var(--warning)" />} 
              Mode Tema
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {theme === 'dark' ? 'Gelap' : theme === 'light' ? 'Terang' : 'Kontras Tinggi'}
            </span>
          </button>

          {/* Ukuran Teks (Zoom) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '12px', background: 'var(--panel-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-primary)' }}>
              <Type size={18} color="var(--primary)" />
              Ukuran Teks
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              {['normal', 'large', 'xlarge'].map((sz) => {
                const label = sz === 'normal' ? 'Normal' : sz === 'large' ? 'Besar' : 'Sangat Besar';
                const isSelected = fontSize === sz;
                return (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--surface-border)',
                      background: isSelected ? 'var(--primary)' : 'var(--panel-track-bg)',
                      color: isSelected ? 'white' : 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    aria-label={`Ubah ukuran teks ke ${label}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Asisten Suara */}
          <button 
            onClick={() => setVoiceNarrator(!voiceNarrator)}
            className="btn"
            style={{ 
              background: 'var(--panel-bg)', color: 'var(--text-primary)', 
              border: '1px solid var(--surface-border)', justifyContent: 'space-between'
            }}
            aria-label={`Asisten Suara. Status saat ini: ${voiceNarrator ? 'Aktif' : 'Nonaktif'}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {voiceNarrator ? <Volume2 size={18} color="var(--success)" /> : <VolumeX size={18} color="var(--text-secondary)" />} 
              Asisten Suara (TTS)
            </div>
            <span style={{ fontSize: '0.8rem', color: voiceNarrator ? 'var(--success)' : 'var(--text-secondary)', fontWeight: '600' }}>
              {voiceNarrator ? 'Aktif' : 'Nonaktif'}
            </span>
          </button>

          {/* Logout */}
          <button 
            onClick={onLogout}
            className="btn btn-danger"
            style={{ marginTop: '16px' }}
            aria-label="Keluar Akun"
          >
            <LogOut size={18} /> Keluar Akun
          </button>

        </div>
      </div>
    </div>
  );
}

