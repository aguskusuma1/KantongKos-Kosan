import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export function useBudget(userId) {
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [todayBudget, setTodayBudget] = useState(0);
  const [todaySpent, setTodaySpent] = useState(0);

  const currentDate = new Date();
  const currentMonthYear = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  
  // Format date correctly in local time
  const todayStr = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000))
    .toISOString()
    .split('T')[0];

  useEffect(() => {
    if (!userId) return;
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const budgetRes = await api.fetch('get_budget', {
        params: { month_year: currentMonthYear }
      });

      if (budgetRes.data) {
        setBudget(budgetRes.data);
      }

      // Start of month
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const startStr = new Date(startOfMonth.getTime() - (startOfMonth.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      
      // End of month
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
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
  };

  useEffect(() => {
    if (!budget) return;
    
    const spentToday = expenses
      .filter(e => e.expense_date === todayStr)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    setTodaySpent(spentToday);

    const spentBeforeToday = expenses
      .filter(e => e.expense_date < todayStr)
      .reduce((sum, e) => sum + Number(e.amount), 0);
      
    const remainingBudgetBeforeToday = budget.total_budget - spentBeforeToday;
    
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const currentDay = currentDate.getDate();
    const remainingDays = daysInMonth - currentDay + 1;
    
    const calculatedTodayBudget = Math.max(0, remainingBudgetBeforeToday / remainingDays);
    setTodayBudget(calculatedTodayBudget);
    
  }, [budget, expenses, todayStr]);

  const saveBudget = async (amount) => {
    try {
      const res = await api.fetch('save_budget', {
        method: 'POST',
        body: { month_year: currentMonthYear, total_budget: amount }
      });
      if (res.data) {
        setBudget(res.data);
      }
    } catch (error) {
      console.error("Error saveBudget:", error);
      alert("Gagal menyimpan budget: " + error.message);
    }
  };

  const addExpense = async (amount, description) => {
    try {
      const res = await api.fetch('add_expense', {
        method: 'POST',
        body: { amount, description, expense_date: todayStr }
      });
      if (res.data) {
        setExpenses([...expenses, res.data]);
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
    expenses
  };
}
