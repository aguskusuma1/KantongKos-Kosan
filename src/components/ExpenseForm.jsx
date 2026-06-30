import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function ExpenseForm({ onAddExpense }) {
  const todayStr = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState(todayStr);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    
    setIsSubmitting(true);
    await onAddExpense(Number(amount), desc, date);
    
    setAmount('');
    setDesc('');
    setDate(todayStr);
    setIsSubmitting(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '20px' }} role="region" aria-label="Form Catat Pengeluaran Baru">
      <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Catat Pengeluaran Baru</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input 
            type="number" 
            className="input-field" 
            placeholder="Nominal (Rp)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            aria-label="Nominal pengeluaran dalam Rupiah"
          />
        </div>
        <div className="input-group">
          <input 
            type="text" 
            className="input-field" 
            placeholder="Keterangan (Opsional)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            aria-label="Keterangan atau rincian pengeluaran"
          />
        </div>
        <div className="input-group">
          <input 
            type="date" 
            className="input-field" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{ color: 'var(--text-primary)' }}
            aria-label="Tanggal pengeluaran"
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isSubmitting}
          aria-label={isSubmitting ? 'Mencatat pengeluaran...' : 'Tambah Pengeluaran'}
        >
          <Plus size={20} />
          {isSubmitting ? 'Mencatat...' : 'Tambah Pengeluaran'}
        </button>
      </form>
    </div>
  );
}
