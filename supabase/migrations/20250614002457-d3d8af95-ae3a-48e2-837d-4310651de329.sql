
-- First, create the admin_accounts table
CREATE TABLE public.admin_accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  email text,
  real_name text,
  status text DEFAULT 'active',
  is_builtin boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert the built-in admin account
INSERT INTO public.admin_accounts (username, password_hash, email, real_name, status, is_builtin)
VALUES ('account_admin', 'AdminAcc93', 'roadsaverapp.acc.manager@gmail.com', 'Account Administrator', 'active', true);

-- Rename existing_user_accounts to user_accounts
ALTER TABLE public.existing_user_accounts RENAME TO user_accounts;

-- Add is_builtin column to user_accounts
ALTER TABLE public.user_accounts ADD COLUMN is_builtin boolean DEFAULT false;

-- Transfer data from new_user_accounts to user_accounts (if any exists)
INSERT INTO public.user_accounts (username, email, phone_number, gender, password_hash, is_builtin, created_at)
SELECT username, email, phone_number, gender, password_hash, false, created_at
FROM public.new_user_accounts;

-- Insert the built-in user account
INSERT INTO public.user_accounts (username, password_hash, email, status, is_builtin)
VALUES ('user', 'user123', 'user@example.com', 'active', true);

-- Add is_builtin column to employee_accounts
ALTER TABLE public.employee_accounts ADD COLUMN is_builtin boolean DEFAULT false;

-- Update the built-in employee account (change admin to employee)
UPDATE public.employee_accounts 
SET username = 'employee', password_hash = 'employee123', is_builtin = true
WHERE username = 'admin';

-- If the employee doesn't exist, insert it
INSERT INTO public.employee_accounts (username, password_hash, email, employee_role, status, is_builtin, real_name)
SELECT 'employee', 'employee123', 'employee@example.com', 'technician', 'active', true, 'Built-in Employee'
WHERE NOT EXISTS (SELECT 1 FROM public.employee_accounts WHERE username = 'employee');

-- Drop the new_user_accounts table
DROP TABLE public.new_user_accounts;

-- Update any references in other tables from existing_user_accounts to user_accounts
-- (This will depend on what foreign key relationships exist)

-- Enable RLS on admin_accounts
ALTER TABLE public.admin_accounts ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policy for admin_accounts (admins can manage themselves)
CREATE POLICY "Admins can view their own account" 
  ON public.admin_accounts 
  FOR SELECT 
  USING (true); -- For now, allow all reads - can be restricted later

CREATE POLICY "Admins can update their own account" 
  ON public.admin_accounts 
  FOR UPDATE 
  USING (true); -- For now, allow all updates - can be restricted later
