-- Order States Table Creation Script
-- Module: Order State Management
-- Status: Final & Locked for v1

CREATE TABLE IF NOT EXISTS order_states (
    -- 1. System & Identity (Core – Mandatory)
    id SERIAL PRIMARY KEY,
    state_name VARCHAR(100) NOT NULL UNIQUE,
    
    -- 2. Basic Information
    description TEXT,
    
    -- 3. Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- 4. Lifecycle & Audit (System Managed)
    created_by INT REFERENCES agencies(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by INT REFERENCES agencies(id) ON DELETE SET NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX idx_order_states_state_name ON order_states(state_name);
CREATE INDEX idx_order_states_is_active ON order_states(is_active);
CREATE INDEX idx_order_states_created_at ON order_states(created_at DESC);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_order_states_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_order_states_timestamp
    BEFORE UPDATE ON order_states
    FOR EACH ROW
    EXECUTE FUNCTION update_order_states_updated_at();

-- Comments for documentation
COMMENT ON TABLE order_states IS 'Stores order state definitions for order management';
COMMENT ON COLUMN order_states.id IS 'Auto-incrementing integer primary key';
COMMENT ON COLUMN order_states.state_name IS 'Unique name of the order state';
COMMENT ON COLUMN order_states.description IS 'Description of the order state';
COMMENT ON COLUMN order_states.is_active IS 'Whether the order state is currently active';
COMMENT ON COLUMN order_states.created_by IS 'Agency ID that created this order state';
COMMENT ON COLUMN order_states.created_at IS 'Timestamp when the order state was created';
COMMENT ON COLUMN order_states.updated_by IS 'Agency ID that last updated this order state';
COMMENT ON COLUMN order_states.updated_at IS 'Timestamp when the order state was last updated';
