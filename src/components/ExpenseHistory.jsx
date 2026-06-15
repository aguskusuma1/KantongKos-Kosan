import React, { useState } from 'react';
import { Calendar, FileText } from 'lucide-react';

export default function ExpenseHistory({ expenses }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);

  // Helper to get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Create calendar grid
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push({
      day: i,
      dateStr,
      hasExpense: expenses.some(e => e.expense_date === dateStr)
    });
  }

  const selectedExpenses = expenses.filter(e => e.expense_date === selectedDate);

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '24px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Calendar size={20} color="var(--primary)" />
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Kalender Pengeluaran</h2>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '12px', fontWeight: '500' }}>
        {monthNames[currentMonth]} {currentYear}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '4px', 
        textAlign: 'center',
        marginBottom: '8px'
      }}>
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
          <div key={d} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{d}</div>
        ))}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '4px'
      }}>
        {days.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} />;
          
          const isSelected = d.dateStr === selectedDate;
          const isToday = d.dateStr === today.toISOString().split('T')[0];
          
          return (
            <button
              key={d.dateStr}
              onClick={() => setSelectedDate(d.dateStr)}
              style={{
                background: isSelected ? 'var(--primary)' : (d.hasExpense ? 'rgba(59, 130, 246, 0.2)' : 'transparent'),
                color: isSelected ? 'white' : 'var(--text-primary)',
                border: isToday && !isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 0',
                cursor: 'pointer',
                fontWeight: isSelected ? '600' : '400',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {d.day}
              {d.hasExpense && !isSelected && (
                <div style={{
                  position: 'absolute',
                  bottom: '2px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'var(--primary)'
                }} />
              )}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <FileText size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '1rem', margin: 0 }}>Catatan: {selectedDate}</h3>
        </div>

        {selectedExpenses.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedExpenses.map((exp, idx) => (
              <div key={idx} style={{ 
                background: 'rgba(15, 23, 42, 0.4)', 
                padding: '12px', 
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderLeft: '3px solid var(--primary)'
              }}>
                <span style={{ fontSize: '0.9rem' }}>{exp.description || 'Pengeluaran'}</span>
                <span style={{ fontWeight: '600', color: 'var(--danger)' }}>
                  -Rp {Number(exp.amount).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px', 
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            background: 'rgba(15, 23, 42, 0.2)',
            borderRadius: 'var(--radius-sm)'
          }}>
            Tidak ada catatan pengeluaran di tanggal ini.
          </div>
        )}
      </div>
    </div>
  );
}
