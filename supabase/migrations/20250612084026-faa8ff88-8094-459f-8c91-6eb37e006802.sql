
-- Create service_requests table with the new structure
CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Flat Tyre', 'Out of Fuel', 'Car Battery', 'Other Car Problems', 'Tow Truck')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'quote_sent', 'quote_revised', 'accepted', 'in_progress', 'completed', 'cancelled', 'declined')),
  assigned_employee_id TEXT,
  price_quote NUMERIC,
  revised_price_quote NUMERIC,
  decline_count INTEGER DEFAULT 0,
  description TEXT,
  user_location POINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table with ban system
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  location POINT,
  ban_count INTEGER DEFAULT 0,
  banned_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  is_simulated BOOLEAN DEFAULT false,
  location POINT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_sessions table for tracking logout timers
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  logout_timer_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create price_ranges configuration table
CREATE TABLE IF NOT EXISTS public.price_ranges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type TEXT UNIQUE NOT NULL,
  min_price NUMERIC NOT NULL,
  max_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default price ranges
INSERT INTO public.price_ranges (service_type, min_price, max_price) VALUES
('Flat Tyre', 40, 120),
('Out of Fuel', 30, 70),
('Car Battery', 30, 50),
('Other Car Problems', 30, 50),
('Tow Truck', 50, 150)
ON CONFLICT (service_type) DO UPDATE SET
  min_price = EXCLUDED.min_price,
  max_price = EXCLUDED.max_price;

-- Enable RLS on all tables
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_ranges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own requests" ON public.service_requests
  FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can create their own requests" ON public.service_requests
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Employees can view assigned requests" ON public.service_requests
  FOR SELECT USING (assigned_employee_id = current_setting('app.current_employee_id', true));

CREATE POLICY "Employees can update assigned requests" ON public.service_requests
  FOR UPDATE USING (assigned_employee_id = current_setting('app.current_employee_id', true));

-- Public read access for price ranges
CREATE POLICY "Anyone can view price ranges" ON public.price_ranges
  FOR SELECT USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for service_requests
CREATE TRIGGER update_service_requests_updated_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate price quote for a service type
CREATE OR REPLACE FUNCTION generate_price_quote(service_type TEXT)
RETURNS NUMERIC AS $$
DECLARE
  price_range RECORD;
  random_price NUMERIC;
BEGIN
  SELECT min_price, max_price INTO price_range
  FROM public.price_ranges
  WHERE service_type = generate_price_quote.service_type;
  
  IF price_range IS NULL THEN
    RETURN 50; -- Default price if no range found
  END IF;
  
  random_price := price_range.min_price + (RANDOM() * (price_range.max_price - price_range.min_price));
  RETURN ROUND(random_price, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to validate price quote
CREATE OR REPLACE FUNCTION is_valid_price(service_type TEXT, price NUMERIC)
RETURNS BOOLEAN AS $$
DECLARE
  price_range RECORD;
BEGIN
  SELECT min_price, max_price INTO price_range
  FROM public.price_ranges
  WHERE service_type = is_valid_price.service_type;
  
  IF price_range IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN price >= price_range.min_price AND price <= price_range.max_price;
END;
$$ LANGUAGE plpgsql;
