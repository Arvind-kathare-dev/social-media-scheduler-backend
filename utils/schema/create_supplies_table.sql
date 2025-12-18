-- Supplies Table Creation Script
-- Module: Supplies Management (Patient Supply Orders)
-- Status: Final & Locked for v1

CREATE TABLE IF NOT EXISTS supplies (
    -- 1. System & Identity (Core – Mandatory)
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    
    -- 2. Patient & Clinician Information
    patient_name VARCHAR(255) NOT NULL,
    clinician_name VARCHAR(255) NOT NULL,
    
    -- 3. Order Details
    items TEXT NOT NULL,
    total_items INT NOT NULL DEFAULT 0,
    order_date DATE NOT NULL,
    
    -- 4. Insurance Information
    insurance_type VARCHAR(100),
    
    -- 5. Approval Status
    is_approve BOOLEAN DEFAULT FALSE,
    is_decline BOOLEAN DEFAULT FALSE,
    
    -- 6. Lifecycle & Audit (System Managed)
    created_by INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX idx_supplies_order_id ON supplies(order_id);
CREATE INDEX idx_supplies_patient_name ON supplies(patient_name);
CREATE INDEX idx_supplies_clinician_name ON supplies(clinician_name);
CREATE INDEX idx_supplies_order_date ON supplies(order_date DESC);
CREATE INDEX idx_supplies_insurance_type ON supplies(insurance_type);
CREATE INDEX idx_supplies_created_at ON supplies(created_at DESC);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_supplies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_supplies_timestamp
    BEFORE UPDATE ON supplies
    FOR EACH ROW
    EXECUTE FUNCTION update_supplies_updated_at();

-- Comments for documentation
COMMENT ON TABLE supplies IS 'Stores patient supply orders for supplies management';
COMMENT ON COLUMN supplies.id IS 'Auto-incrementing integer primary key';
COMMENT ON COLUMN supplies.order_id IS 'Unique order identifier (e.g., 102451)';
COMMENT ON COLUMN supplies.patient_name IS 'Name of the patient';
COMMENT ON COLUMN supplies.clinician_name IS 'Name of the clinician';
COMMENT ON COLUMN supplies.items IS 'Supply items ordered (e.g., Adult Diapers, IV Drip, Ice Packs)';
COMMENT ON COLUMN supplies.total_items IS 'Total number of items in the order';
COMMENT ON COLUMN supplies.order_date IS 'Date when the order was placed';
COMMENT ON COLUMN supplies.insurance_type IS 'Type of insurance (Medicare, Private, etc.)';
COMMENT ON COLUMN supplies.is_approve IS 'Approval status (default: false)';
COMMENT ON COLUMN supplies.is_decline IS 'Decline status (default: false)';
COMMENT ON COLUMN supplies.created_by IS 'User ID that created this supply order';
COMMENT ON COLUMN supplies.created_at IS 'Timestamp when the supply order was created';
COMMENT ON COLUMN supplies.updated_by IS 'User ID that last updated this supply order';
COMMENT ON COLUMN supplies.updated_at IS 'Timestamp when the supply order was last updated';
