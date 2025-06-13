
-- First, let's add the missing columns from employees table to employee_accounts
ALTER TABLE employee_accounts 
ADD COLUMN IF NOT EXISTS location point,
ADD COLUMN IF NOT EXISTS is_available boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS is_simulated boolean DEFAULT false;

-- Migrate any existing data from employees to employee_accounts if there are matching records
-- This is a safe operation that won't affect existing employee_accounts data
UPDATE employee_accounts 
SET 
  location = employees.location,
  is_available = employees.is_available,
  is_simulated = employees.is_simulated
FROM employees 
WHERE employee_accounts.real_name = employees.name 
  OR employee_accounts.username = employees.name;

-- Drop the employees table since we're consolidating everything into employee_accounts
DROP TABLE IF EXISTS employees;
