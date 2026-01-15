-- Indexes for Feature Flags
CREATE INDEX IF NOT EXISTS idx_flags_key ON flags(key);
CREATE INDEX IF NOT EXISTS idx_flags_archived ON flags(archived);

-- Indexes for Configurations
CREATE INDEX IF NOT EXISTS idx_configs_key ON configs(key);
CREATE INDEX IF NOT EXISTS idx_configs_environment ON configs(environment);

-- Indexes for Audit Logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
