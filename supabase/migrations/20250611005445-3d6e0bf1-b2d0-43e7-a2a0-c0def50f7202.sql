
-- Add indexes for foreign keys to improve query performance
CREATE INDEX IF NOT EXISTS idx_employee_accounts_auth_user_id ON employee_accounts(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_employee_finished_requests_snapshot_id ON employee_finished_requests(snapshot_id);
CREATE INDEX IF NOT EXISTS idx_existing_user_accounts_auth_user_id ON existing_user_accounts(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_user_finished_requests_snapshot_id ON user_finished_requests(snapshot_id);

-- Remove unused indexes to improve maintenance performance
DROP INDEX IF EXISTS idx_price_quote_snapshots_status;
DROP INDEX IF EXISTS idx_employee_finished_requests_employee_id;
DROP INDEX IF EXISTS idx_user_history_completion_date;
