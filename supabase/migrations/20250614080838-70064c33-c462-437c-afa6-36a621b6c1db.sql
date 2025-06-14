
-- Create upper_management_accounts table
CREATE TABLE public.upper_management_accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id uuid NOT NULL REFERENCES public.employee_accounts(id) ON DELETE CASCADE,
  management_role text NOT NULL CHECK (management_role IN ('supervisor', 'manager', 'district manager', 'owner', 'co-owner', 'partner')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(employee_id)
);

-- Enable RLS on upper_management_accounts table
ALTER TABLE public.upper_management_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for upper_management_accounts
CREATE POLICY "Allow all operations on upper_management_accounts" 
ON public.upper_management_accounts 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION public.update_upper_management_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE TRIGGER update_upper_management_accounts_updated_at
  BEFORE UPDATE ON public.upper_management_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_upper_management_updated_at();
