-- Admin accounts table
CREATE TABLE admin_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'away')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group chat history (auto-deletes after 30 days)
CREATE TABLE group_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('admin', 'employee')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
) WITH (
  autovacuum_enabled = true,
  autovacuum_vacuum_threshold = 50
);

-- Employee chat history (auto-deletes after 30 days)
CREATE TABLE employee_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employee_accounts(id),
  sender_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_group BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
) WITH (
  autovacuum_enabled = true,
  autovacuum_vacuum_threshold = 50
);

-- Admin chat history (auto-deletes after 30 days)
CREATE TABLE admin_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_accounts(id),
  sender_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_group BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
) WITH (
  autovacuum_enabled = true,
  autovacuum_vacuum_threshold = 50
);

-- Auto-delete policy (run daily via cron job)
CREATE OR REPLACE FUNCTION delete_old_chats()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM group_chat_history WHERE created_at < NOW() - INTERVAL '30 days';
  DELETE FROM employee_chat_history WHERE created_at < NOW() - INTERVAL '30 days';
  DELETE FROM admin_chat_history WHERE created_at < NOW() - INTERVAL '30 days';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;