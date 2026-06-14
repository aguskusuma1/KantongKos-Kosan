import React from 'react';
import VisualMeter from './VisualMeter';
import ExpenseForm from './ExpenseForm';

export default function Dashboard({ budgetLimit, todaySpent, onAddExpense, totalBudget }) {
  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', background: 'linear-gradient(to right, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Auto-Budgeting
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tanpa Ribet</p>
      </header>

      <VisualMeter budgetLimit={budgetLimit} todaySpent={todaySpent} />
      
      <ExpenseForm onAddExpense={onAddExpense} />
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Total Budget Bulan Ini: Rp {Math.round(totalBudget).toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  );
}
