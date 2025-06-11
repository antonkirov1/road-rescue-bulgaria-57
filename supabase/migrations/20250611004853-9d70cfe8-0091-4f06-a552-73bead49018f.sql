
-- Fix the security warnings by setting search_path for the database functions

-- Update create_employee_account function with proper search_path
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

-- Update migrate_new_user_to_existing function with proper search_path
CREATE OR REPLACE FUNCTION public.migrate_new_user_to_existing(user_record_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_record RECORD;
  auth_user_id uuid;
BEGIN
  -- Get the new user record
  SELECT * INTO new_user_record 
  FROM public.new_user_accounts 
  WHERE id = user_record_id AND processed_at IS NULL;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Create auth user (this would typically be done through Supabase Auth API)
  -- For now, we'll just insert into existing_user_accounts without auth integration
  
  -- Insert into existing_user_accounts
  INSERT INTO public.existing_user_accounts (
    username, 
    email, 
    phone_number, 
    gender
  ) VALUES (
    new_user_record.username,
    new_user_record.email,
    new_user_record.phone_number,
    new_user_record.gender
  );
  
  -- Mark as processed
  UPDATE public.new_user_accounts 
  SET processed_at = now() 
  WHERE id = user_record_id;
  
  -- Delete from new_user_accounts after successful migration
  DELETE FROM public.new_user_accounts 
  WHERE id = user_record_id;
  
  RETURN true;
END;
$$;
