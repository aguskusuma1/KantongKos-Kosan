import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export function useBudget(userId) {
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const currentMonthYearStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const selectedMonthYear = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
  const isCurrentMonth = selectedMonthYear === currentMonthYearStr;
  
  // Format date correctly in local time
  const todayStr = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000))
    .toISOString()
    .split('T')[0];

  useEffect(() => {
    if (!userId) return;
    fetchData();
  }, [userId, selectedMonthYear]);

  async function fetchData() {
    setLoading(true);
    setBudget(null);
    setExpenses([]);
    
    try {
      const budgetRes = await api.fetch('get_budget', {
        params: { month_year: selectedMonthYear }
      });

      if (budgetRes.data) {
        setBudget(budgetRes.data);
      }

      // Start of selected month
      const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const startStr = new Date(startOfMonth.getTime() - (startOfMonth.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      
      // End of selected month
      const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
      const endStr = new Date(endOfMonth.getTime() - (endOfMonth.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

      const expensesRes = await api.fetch('get_expenses', {
        params: { start_date: startStr, end_date: endStr }
      });

      if (expensesRes.data) {
        setExpenses(expensesRes.data);
      }
    } catch (e) {
      console.error("Error fetching data", e);
    }
    
    setLoading(false);
  }

  // Navigation functions
  const nextMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const todaySpent = expenses
    .filter(e => e.expense_date === todayStr)
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const spentBeforeToday = expenses
    .filter(e => e.expense_date < todayStr)
    .reduce((sum, e) => sum + Number(e.amount), 0);
    
  let todayBudget = 0;
  let remainingBudgetBeforeToday = 0;
  let remainingDays = 0;
  
  if (budget) {
    if (budget.mode === 'mingguan') {
      const currLocal = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000));
      const dayOfWeek = currLocal.getUTCDay(); 
      const diffToMonday = currLocal.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const startOfWeekDate = new Date(currLocal);
      startOfWeekDate.setUTCDate(diffToMonday);
      const startOfWeekStr = startOfWeekDate.toISOString().split('T')[0];

      const spentBeforeTodayInWeek = expenses
        .filter(e => e.expense_date >= startOfWeekStr && e.expense_date < todayStr)
        .reduce((sum, e) => sum + Number(e.amount), 0);
        
      remainingBudgetBeforeToday = budget.total_budget - spentBeforeTodayInWeek;
      
      const currentDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
      remainingDays = 7 - currentDayOfWeek + 1;
      todayBudget = Math.max(0, remainingBudgetBeforeToday / remainingDays);
    } else {
      remainingBudgetBeforeToday = budget.total_budget - spentBeforeToday;
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      const currentDay = currentDate.getDate();
      remainingDays = daysInMonth - currentDay + 1;
      todayBudget = Math.max(0, remainingBudgetBeforeToday / remainingDays);
    }
  }

  // If viewing history, todayBudget isn't strictly applicable, but Dashboard will handle UI for it.

  const saveBudget = async (amount, mode = 'bulanan') => {
    try {
      const res = await api.fetch('save_budget', {
        method: 'POST',
        // Always save to current month, even if viewing history (to avoid confusion)
        // Actually, user should only edit current month.
        body: { month_year: currentMonthYearStr, total_budget: amount, mode }
      });
      if (res.data) {
        // If they are viewing current month, update state
        if (isCurrentMonth) {
          setBudget(res.data);
        } else {
          // If they save while viewing history somehow, jump to current month
          setSelectedDate(new Date());
        }
      }
    } catch (error) {
      console.error("Error saveBudget:", error);
      alert("Gagal menyimpan budget: " + error.message);
    }
  };

  const addExpense = async (amount, description, date = todayStr) => {
    try {
      const res = await api.fetch('add_expense', {
        method: 'POST',
        body: { amount, description, expense_date: date }
      });
      if (res.data) {
        // Only append if the expense date falls in the selected month
        const expenseMonth = res.data.expense_date.substring(0, 7);
        if (expenseMonth === selectedMonthYear) {
          setExpenses([...expenses, res.data]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    loading,
    budget,
    todayBudget,
    todaySpent,
    saveBudget,
    addExpense,
    expenses,
    selectedDate,
    nextMonth,
    prevMonth,
    isCurrentMonth
  };
}
