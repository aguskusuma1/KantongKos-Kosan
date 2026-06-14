-- Schema untuk Auto-Budgeting Web App

-- 1. Tabel users_budget (Menyimpan pengaturan budget bulanan)
CREATE TABLE public.user_budgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- Diisi dengan ID dari Supabase Auth, atau ID dummy jika tanpa auth
    month_year VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    total_budget NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, month_year)
);

-- 2. Tabel expenses (Menyimpan daftar pengeluaran)
CREATE TABLE public.expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    amount NUMERIC NOT NULL,
    description TEXT,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Security/RLS (Row Level Security) - Opsional, aktifkan jika menggunakan Supabase Auth
-- ALTER TABLE public.user_budgets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
