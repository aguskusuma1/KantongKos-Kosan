import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VisualMeter from './VisualMeter';
import ExpenseForm from './ExpenseForm';
import ExpenseHistory from './ExpenseHistory';
import FoodRecommendations from './FoodRecommendations';
import MonthlyChart from './MonthlyChart';
import WeeklyChart from './WeeklyChart';

export default function Dashboard({ 
  budgetLimit, todaySpent, onAddExpense, totalBudget, expenses, budgetMode,
  selectedDate, nextMonth, prevMonth, isCurrentMonth
}) {
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const monthName = monthNames[selectedDate.getMonth()];
  const year = selectedDate.getFullYear();
  
  const totalSpentMonth = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', background: 'linear-gradient(to right, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Auto-Budgeting
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tanpa Ribet</p>
      </header>

      {/* Navigasi Bulan */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={prevMonth} style={{ background: 'var(--panel-track-bg)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ fontSize: '1.1rem', fontWeight: '600', minWidth: '120px', textAlign: 'center' }}>
          {monthName} {year}
        </div>
        <button onClick={nextMonth} disabled={isCurrentMonth} style={{ background: 'var(--panel-track-bg)', border: 'none', borderRadius: '50%', padding: '8px', cursor: isCurrentMonth ? 'not-allowed' : 'pointer', color: isCurrentMonth ? 'var(--text-secondary)' : 'var(--text-primary)', opacity: isCurrentMonth ? 0.5 : 1 }}>
          <ChevronRight size={20} />
        </button>
      </div>

      <VisualMeter 
        budgetLimit={isCurrentMonth ? budgetLimit : totalBudget} 
        todaySpent={isCurrentMonth ? todaySpent : totalSpentMonth} 
        isHistory={!isCurrentMonth}
      />
      
      {isCurrentMonth && <ExpenseForm onAddExpense={onAddExpense} />}
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Total Budget {budgetMode === 'mingguan' ? 'Minggu' : 'Bulan'} Ini: Rp {Math.round(totalBudget).toLocaleString('id-ID')}
        </p>
      </div>

      <WeeklyChart expenses={expenses || []} totalBudget={totalBudget} />
      
      <MonthlyChart expenses={expenses || []} totalBudget={totalBudget} />

      <ExpenseHistory expenses={expenses || []} totalBudget={totalBudget} />
      
      <FoodRecommendations />
    </div>
  );
}
