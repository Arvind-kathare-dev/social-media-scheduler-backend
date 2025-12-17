-- Order Types Table Creation Script
-- Module: Order Type Management
-- Status: Final & Locked for v1

CREATE TABLE IF NOT EXISTS order_types (
    -- 1. System & Identity (Core – Mandatory)
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL UNIQUE,
    
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
CREATE INDEX idx_order_types_type_name ON order_types(type_name);
CREATE INDEX idx_order_types_is_active ON order_types(is_active);
CREATE INDEX idx_order_types_created_at ON order_types(created_at DESC);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_order_types_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_order_types_timestamp
    BEFORE UPDATE ON order_types
    FOR EACH ROW
    EXECUTE FUNCTION update_order_types_updated_at();

-- Comments for documentation
COMMENT ON TABLE order_types IS 'Stores order type definitions for order management';
COMMENT ON COLUMN order_types.id IS 'Auto-incrementing integer primary key';
COMMENT ON COLUMN order_types.type_name IS 'Unique name of the order type';
COMMENT ON COLUMN order_types.description IS 'Description of the order type';
COMMENT ON COLUMN order_types.is_active IS 'Whether the order type is currently active';
COMMENT ON COLUMN order_types.created_by IS 'Agency ID that created this order type';
COMMENT ON COLUMN order_types.created_at IS 'Timestamp when the order type was created';
COMMENT ON COLUMN order_types.updated_by IS 'Agency ID that last updated this order type';
COMMENT ON COLUMN order_types.updated_at IS 'Timestamp when the order type was last updated';
