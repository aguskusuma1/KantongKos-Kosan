import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function VisualMeter({ budgetLimit, todaySpent }) {
  const isOver = todaySpent > budgetLimit;
  const percentageRaw = budgetLimit > 0 ? (todaySpent / budgetLimit) * 100 : 0;
  const percentage = Math.min(percentageRaw, 100);
  
  // Color logic
  let color = 'var(--success)';
  let message = 'Pengeluaran aman hari ini!';
  let Icon = CheckCircle2;
  
  if (isOver) {
    color = 'var(--danger)';
    message = 'Over budget! Besok jatah akan dikurangi.';
    Icon = AlertTriangle;
  } else if (percentage > 80) {
    color = 'var(--warning)';
    message = 'Hati-hati, sudah mendekati batas.';
  }

  // Circular gauge SVG calculation
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass-panel" style={{ textAlign: 'center', marginBottom: '24px' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Budget Hari Ini</h3>
      
      <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto' }}>
        <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="var(--surface-border)"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={color}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease' }}
            strokeLinecap="round"
          />
        </svg>
        
        <div style={{ 
          position: 'absolute', 
          top: 0, left: 0, width: '100%', height: '100%', 
          display: 'flex', flexDirection: 'column', 
          justifyContent: 'center', alignItems: 'center' 
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Terpakai</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: color }}>
            Rp {Math.round(todaySpent).toLocaleString('id-ID')}
          </span>
        </div>
      </div>
      
      <div style={{ marginTop: '16px' }}>
        <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
          Limit Harian: <strong>Rp {Math.round(budgetLimit).toLocaleString('id-ID')}</strong>
        </p>
        
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          color: color, background: `${color}20`, padding: '8px 12px', borderRadius: 'var(--radius-full)',
          fontSize: '0.85rem', fontWeight: '500'
        }}>
          <Icon size={16} />
          {message}
        </div>
      </div>
    </div>
  );
}
