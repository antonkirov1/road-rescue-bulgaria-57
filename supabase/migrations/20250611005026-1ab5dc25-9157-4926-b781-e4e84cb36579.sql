
-- Drop any existing versions of the create_employee_account function and recreate with proper security
DROP FUNCTION IF EXISTS public.create_employee_account(text, text, text, text);
DROP FUNCTION IF EXISTS public.create_employee_account(text, text, text, text, text);

-- Create the proper version with security definer and search path
CREATE OR REPLACE FUNCTION public.create_employee_account(
  p_username text,
  p_email text,
  p_phone_number text DEFAULT NULL,
  p_employee_role text DEFAULT 'technician',
  p_real_name text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_employee_id uuid;
BEGIN
  -- Insert into employee_accounts table
  INSERT INTO employee_accounts (
    username,
    email,
    phone_number,
    employee_role,
    real_name,
    status
  ) VALUES (
    p_username,
    p_email,
    p_phone_number,
    p_employee_role,
    p_real_name,
    'active'
  ) RETURNING id INTO new_employee_id;

  RETURN new_employee_id;
END;
$$;
