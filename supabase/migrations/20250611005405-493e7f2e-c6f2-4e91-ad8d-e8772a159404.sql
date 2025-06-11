
-- Add RLS policies for simulated_employee_history table
-- Since this appears to be a simulation/testing table, we'll allow public access for simulation purposes

CREATE POLICY "Allow all operations on simulated_employee_history" ON simulated_employee_history
  FOR ALL USING (true) WITH CHECK (true);
