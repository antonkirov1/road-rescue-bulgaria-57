
-- First, let's ensure we have some basic employee simulation data
INSERT INTO public.employee_simulation (employee_number, full_name)
VALUES 
  (1, 'John Smith'),
  (2, 'Maria Garcia'),
  (3, 'Alex Johnson'),
  (4, 'Sarah Wilson'),
  (5, 'Michael Brown'),
  (6, 'Emily Davis'),
  (7, 'David Rodriguez'),
  (8, 'Lisa Chen'),
  (9, 'Robert Taylor'),
  (10, 'Jennifer White')
ON CONFLICT (employee_number) DO NOTHING;

-- Ensure price ranges table has proper data for all service types
INSERT INTO public.price_ranges (service_type, min_price, max_price)
VALUES 
  ('Flat Tyre', 40, 80),
  ('Out of Fuel', 30, 60),
  ('Car Battery', 60, 120),
  ('Other Car Problems', 50, 150),
  ('Tow Truck', 80, 200)
ON CONFLICT (service_type) DO UPDATE SET
  min_price = EXCLUDED.min_price,
  max_price = EXCLUDED.max_price;

-- Add any missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employee_simulation_employee_number ON public.employee_simulation(employee_number);
CREATE INDEX IF NOT EXISTS idx_price_ranges_service_type ON public.price_ranges(service_type);

-- Ensure the sequence for employee_simulation is properly set
SELECT setval('public.employee_simulation_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.employee_simulation));
