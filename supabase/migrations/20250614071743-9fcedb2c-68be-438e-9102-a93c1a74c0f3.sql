
-- Disable RLS on employee_simulation table since it's used for admin simulation purposes
ALTER TABLE public.employee_simulation DISABLE ROW LEVEL SECURITY;

-- Alternatively, if you want to keep RLS enabled, you can create a policy instead:
-- CREATE POLICY "Allow all operations on employee_simulation" ON public.employee_simulation
-- FOR ALL USING (true) WITH CHECK (true);
