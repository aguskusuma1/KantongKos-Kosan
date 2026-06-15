import { supabase } from './supabase';

export const api = {
  async fetch(action, options = {}) {
    const userId = localStorage.getItem('ab_user_id');
    const body = options.body || {};
    const params = options.params || {};

    try {
      if (action === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email: body.email,
          password: body.password,
        });
        if (error) throw new Error(error.message);
        if (!data.user) throw new Error('Registrasi berhasil, silakan periksa email Anda.');
        return { message: 'Registrasi berhasil', user: { id: data.user.id, email: data.user.email } };
      }

      if (action === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: body.email,
          password: body.password,
        });
        if (error) throw new Error(error.message);
        return { message: 'Login berhasil', user: { id: data.user.id, email: data.user.email } };
      }

      if (!userId) {
        throw new Error('Unauthorized');
      }

      if (action === 'get_budget') {
        const { data, error } = await supabase
          .from('user_budgets')
          .select('*')
          .eq('user_id', userId)
          .eq('month_year', params.month_year)
          .maybeSingle();
        
        if (error) throw new Error(error.message);
        return { data: data || null };
      }

      if (action === 'save_budget') {
        // Find existing first to avoid unique constraint issues if upsert behavior varies
        const { data: existing } = await supabase
          .from('user_budgets')
          .select('id')
          .eq('user_id', userId)
          .eq('month_year', body.month_year)
          .maybeSingle();

        if (existing) {
          const { data, error } = await supabase
            .from('user_budgets')
            .update({ total_budget: body.total_budget })
            .eq('id', existing.id)
            .select()
            .single();
          if (error) throw new Error(error.message);
          return { data };
        } else {
          const { data, error } = await supabase
            .from('user_budgets')
            .insert({ 
              user_id: userId, 
              month_year: body.month_year, 
              total_budget: body.total_budget 
            })
            .select()
            .single();
          if (error) throw new Error(error.message);
          return { data };
        }
      }

      if (action === 'get_expenses') {
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', userId)
          .gte('expense_date', params.start_date)
          .lte('expense_date', params.end_date)
          .order('expense_date', { ascending: true });
          
        if (error) throw new Error(error.message);
        return { data: data || [] };
      }

      if (action === 'add_expense') {
        const { data, error } = await supabase
          .from('expenses')
          .insert({
            user_id: userId,
            amount: body.amount,
            description: body.description,
            expense_date: body.expense_date
          })
          .select()
          .single();
          
        if (error) throw new Error(error.message);
        return { data };
      }

      throw new Error('Aksi tidak dikenali');
    } catch (e) {
      throw e;
    }
  }
};
