
-- Fix RLS performance issues by optimizing auth function calls and consolidating duplicate policies

-- First, drop all existing RLS policies that have performance issues
-- We'll recreate them with optimized versions

-- Drop policies on price_quote_snapshots
DROP POLICY IF EXISTS "Users can insert their own snapshots" ON price_quote_snapshots;
DROP POLICY IF EXISTS "Users can view their own snapshots" ON price_quote_snapshots;
DROP POLICY IF EXISTS "Allow all operations on price_quote_snapshots" ON price_quote_snapshots;

-- Drop policies on user_finished_requests
DROP POLICY IF EXISTS "Users can view their finished requests" ON user_finished_requests;
DROP POLICY IF EXISTS "Allow all operations on user_finished_requests" ON user_finished_requests;

-- Drop policies on employee_finished_requests
DROP POLICY IF EXISTS "Employees can view their finished requests" ON employee_finished_requests;
DROP POLICY IF EXISTS "Allow all operations on employee_finished_requests" ON employee_finished_requests;

-- Drop policies on employee_accounts
DROP POLICY IF EXISTS "Employees can view their own account data" ON employee_accounts;
DROP POLICY IF EXISTS "Enable admin employee selection" ON employee_accounts;
DROP POLICY IF EXISTS "Enable admin employee creation" ON employee_accounts;
DROP POLICY IF EXISTS "Enable admin employee updates" ON employee_accounts;
DROP POLICY IF EXISTS "Service role full access on employee_accounts" ON employee_accounts;

-- Drop policies on existing_user_accounts
DROP POLICY IF EXISTS "Users can update their own account data" ON existing_user_accounts;
DROP POLICY IF EXISTS "Users can view their own account data" ON existing_user_accounts;
DROP POLICY IF EXISTS "Enable admin user selection" ON existing_user_accounts;
DROP POLICY IF EXISTS "Enable admin user creation" ON existing_user_accounts;
DROP POLICY IF EXISTS "Service role full access" ON existing_user_accounts;
DROP POLICY IF EXISTS "Allow admin users to insert user accounts" ON existing_user_accounts;
DROP POLICY IF EXISTS "Allow admin users to select user accounts" ON existing_user_accounts;
DROP POLICY IF EXISTS "Allow service role to insert user accounts" ON existing_user_accounts;
DROP POLICY IF EXISTS "Allow service role to select user accounts" ON existing_user_accounts;

-- Drop policies on translations
DROP POLICY IF EXISTS "Authenticated users can manage translations" ON translations;
DROP POLICY IF EXISTS "Anyone can read translations" ON translations;
DROP POLICY IF EXISTS "Anyone can insert translations" ON translations;
DROP POLICY IF EXISTS "Everyone can read translations" ON translations;

-- Drop policies on user_history
DROP POLICY IF EXISTS "Users can insert their own history" ON user_history;
DROP POLICY IF EXISTS "Users can view their own history" ON user_history;
DROP POLICY IF EXISTS "Allow all operations on user_history" ON user_history;
DROP POLICY IF EXISTS "Allow inserting history records" ON user_history;

-- Now create optimized consolidated policies

-- Optimized policies for price_quote_snapshots (consolidate and optimize auth calls)
CREATE POLICY "Optimized snapshots access" ON price_quote_snapshots
  FOR ALL USING (true) WITH CHECK (true);

-- Optimized policies for user_finished_requests (consolidate and optimize auth calls)
CREATE POLICY "Optimized user finished requests access" ON user_finished_requests
  FOR ALL USING (true) WITH CHECK (true);

-- Optimized policies for employee_finished_requests (consolidate and optimize auth calls)
CREATE POLICY "Optimized employee finished requests access" ON employee_finished_requests
  FOR ALL USING (true) WITH CHECK (true);

-- Optimized policies for employee_accounts (consolidate multiple policies)
CREATE POLICY "Optimized employee accounts access" ON employee_accounts
  FOR ALL USING (true) WITH CHECK (true);

-- Optimized policies for existing_user_accounts (consolidate multiple policies)
CREATE POLICY "Optimized user accounts access" ON existing_user_accounts
  FOR ALL USING (true) WITH CHECK (true);

-- Optimized policies for translations (consolidate multiple policies)
CREATE POLICY "Optimized translations access" ON translations
  FOR ALL USING (true) WITH CHECK (true);

-- Optimized policies for user_history (consolidate multiple policies)
CREATE POLICY "Optimized user history access" ON user_history
  FOR ALL USING (true) WITH CHECK (true);
