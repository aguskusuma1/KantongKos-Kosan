import React, { useState } from 'react';
import { Calendar, FileText, Activity, Edit2, Trash2, Check, X } from 'lucide-react';

export default function ExpenseHistory({ expenses, totalBudget, onDeleteExpense, onEditExpense }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const handleEditClick = (exp) => {
    setEditingId(exp.id);
    setEditAmount(exp.amount);
    setEditDesc(exp.description);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = (id) => {
    const numAmount = Number(editAmount);
    if (onEditExpense && numAmount > 0) {
      onEditExpense(id, numAmount, editDesc);
      setEditingId(null);
    } else {
      alert("Nominal tidak valid! Pastikan Anda memasukkan angka lebih dari 0.");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus pengeluaran ini?')) {
      if (onDeleteExpense) onDeleteExpense(id);
    }
  };

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
    
    // Calculate daily limits
    const spentBeforeThisDay = expenses
      .filter(e => e.expense_date < dateStr)
      .reduce((sum, e) => sum + Number(e.amount), 0);
      
    const remainingBudgetBeforeThisDay = (totalBudget || 0) - spentBeforeThisDay;
    const remainingDays = daysInMonth - i + 1;
    const budgetLimitForThisDay = totalBudget > 0 ? Math.max(0, remainingBudgetBeforeThisDay / remainingDays) : 0;
    
    const spentOnThisDay = expenses
      .filter(e => e.expense_date === dateStr)
      .reduce((sum, e) => sum + Number(e.amount), 0);
      
    const isOverBudget = spentOnThisDay > budgetLimitForThisDay;
    const hasExpense = spentOnThisDay > 0;

    days.push({
      day: i,
      dateStr,
      hasExpense,
      spent: spentOnThisDay,
      limit: budgetLimitForThisDay,
      isOver: isOverBudget
    });
  }

  const selectedDayObj = days.find(d => d && d.dateStr === selectedDate);
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
        gap: '6px',
        marginBottom: '8px'
      }}>
        {days.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} />;
          
          const isSelected = d.dateStr === selectedDate;
          const isToday = d.dateStr === today.toISOString().split('T')[0];
          
          // Determine color scheme based on budget mapping
          let bgColor = 'transparent';
          let textColor = 'var(--text-primary)';
          let borderColor = '1px solid transparent';
          
          if (d.hasExpense) {
            if (d.isOver) {
              bgColor = 'rgba(239, 68, 68, 0.15)'; // faint red
              textColor = 'var(--danger)';
            } else {
              bgColor = 'rgba(16, 185, 129, 0.15)'; // faint green
              textColor = 'var(--success)';
            }
          }
          
          if (isToday && !isSelected) {
            borderColor = '1px solid var(--primary)';
          }
          
          if (isSelected) {
            borderColor = '2px solid var(--primary)';
            if (!d.hasExpense) bgColor = 'rgba(59, 130, 246, 0.1)';
          }
          
          return (
            <button
              key={d.dateStr}
              onClick={() => setSelectedDate(d.dateStr)}
              style={{
                background: bgColor,
                color: textColor,
                border: borderColor,
                borderRadius: 'var(--radius-sm)',
                padding: '8px 0',
                cursor: 'pointer',
                fontWeight: isSelected || d.hasExpense ? '600' : '400',
                transition: 'all 0.2s ease',
                position: 'relative',
                minHeight: '40px'
              }}
            >
              {d.day}
              {d.hasExpense && (
                <div style={{
                  position: 'absolute',
                  bottom: '2px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: d.isOver ? 'var(--danger)' : 'var(--success)'
                }} />
              )}
            </button>
          );
        })}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div> Aman
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)' }}></div> Over Budget
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Activity size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '1rem', margin: 0 }}>Ringkasan: {selectedDate}</h3>
        </div>

        {selectedDayObj && (
          <div style={{ background: 'var(--panel-item-bg)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Jatah Hari Ini</div>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                Rp {Math.round(selectedDayObj.limit).toLocaleString('id-ID')}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Terpakai</div>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                Rp {Math.round(selectedDayObj.spent).toLocaleString('id-ID')}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Status</div>
              <div style={{ fontWeight: '700', color: selectedDayObj.hasExpense ? (selectedDayObj.isOver ? 'var(--danger)' : 'var(--success)') : 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {!selectedDayObj.hasExpense ? 'Belum Ada' : (selectedDayObj.isOver ? 'Over Budget' : 'Aman')}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', marginTop: '20px' }}>
          <FileText size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '1rem', margin: 0 }}>Catatan Pengeluaran</h3>
        </div>

        {selectedExpenses.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedExpenses.map((exp, idx) => {
              if (editingId === exp.id) {
                return (
                  <div key={idx} style={{ background: 'var(--panel-bg)', padding: '12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--warning)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input type="text" value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Nama Pengeluaran" className="input-field" style={{ padding: '8px', fontSize: '0.9rem' }} />
                    <input type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)} placeholder="Nominal" className="input-field" style={{ padding: '8px', fontSize: '0.9rem' }} />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                      <button onClick={handleCancelEdit} style={{ background: 'transparent', border: '1px solid var(--surface-border)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}><X size={14} /> Batal</button>
                      <button onClick={() => handleSaveEdit(exp.id)} style={{ background: 'var(--success)', border: 'none', padding: '6px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14} /> Simpan</button>
                    </div>
                  </div>
                );
              }
              
              return (
                <div key={idx} style={{ 
                  background: 'var(--panel-bg)', padding: '12px', borderRadius: 'var(--radius-sm)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderLeft: '3px solid var(--primary)'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.9rem' }}>{exp.description || 'Pengeluaran'}</span>
                    <span style={{ fontWeight: '600', color: 'var(--danger)' }}>
                      -Rp {Number(exp.amount).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEditClick(exp)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(exp.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px', 
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            background: 'var(--panel-track-bg)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'center'
          }}>
            <div>Tidak ada catatan pengeluaran di tanggal ini.</div>
            
            <div style={{ width: '100%', maxWidth: '250px', fontSize: '0.8rem', opacity: 0.7, marginTop: '8px' }}>
              <div style={{ marginBottom: '8px' }}>Contoh pencatatan:</div>
              <div style={{ 
                background: 'var(--panel-bg)', padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderLeft: '3px solid var(--primary)',
                color: 'var(--text-primary)',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span>Makan Nasi Jinggo</span>
                  <span style={{ fontWeight: '600', color: 'var(--danger)' }}>-Rp 10.000</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
