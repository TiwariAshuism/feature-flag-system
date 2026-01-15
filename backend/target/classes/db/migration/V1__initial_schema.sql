-- V1__initial_schema.sql

-- Feature Flags Table
CREATE TABLE flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT false,
    flag_type VARCHAR(50) DEFAULT 'BOOLEAN', -- BOOLEAN, STRING, NUMBER, JSON
    default_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    tags TEXT[], -- Array of tags for organization
    archived BOOLEAN DEFAULT false
);

CREATE INDEX idx_flags_key ON flags(key);
CREATE INDEX idx_flags_enabled ON flags(enabled);
CREATE INDEX idx_flags_archived ON flags(archived);

-- Rollout Rules Table
CREATE TABLE rollout_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flag_id UUID REFERENCES flags(id) ON DELETE CASCADE,
    rule_type VARCHAR(50) NOT NULL, -- USER, REGION, PERCENTAGE, CUSTOM
    rule_value JSONB NOT NULL, -- Flexible JSON for different rule types
    enabled BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0, -- Higher priority rules evaluated first
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rollout_rules_flag_id ON rollout_rules(flag_id);
CREATE INDEX idx_rollout_rules_enabled ON rollout_rules(enabled);
CREATE INDEX idx_rollout_rules_priority ON rollout_rules(priority);

-- Configuration Table
CREATE TABLE configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    value JSONB NOT NULL,
    config_type VARCHAR(50) DEFAULT 'JSON',
    environment VARCHAR(50) DEFAULT 'production', -- dev, staging, production
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    version INTEGER DEFAULT 1
);

CREATE INDEX idx_configs_key ON configs(key);
CREATE INDEX idx_configs_environment ON configs(environment);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_flags_updated_at BEFORE UPDATE ON flags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rollout_rules_updated_at BEFORE UPDATE ON rollout_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configs_updated_at BEFORE UPDATE ON configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
