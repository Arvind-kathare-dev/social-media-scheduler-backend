-- Inventory Table Creation Script
-- Module: Inventory Management
-- Status: Final & Locked for v1

CREATE TABLE IF NOT EXISTS inventory (
    -- 1. System & Identity (Core – Mandatory)
    id SERIAL PRIMARY KEY,
    item_code VARCHAR(100) UNIQUE NOT NULL,
    
    -- 2. Basic Information (Mandatory)
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    
    -- 3. Quantity & Measurement
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
    unit_of_measure VARCHAR(50),
    reorder_level DECIMAL(10, 2) DEFAULT 0,
    
    -- 4. Pricing
    unit_price DECIMAL(10, 2),
    
    -- 5. Supplier Information
    supplier_name VARCHAR(255),
    supplier_contact VARCHAR(255),
    
    -- 6. Storage & Tracking
    location VARCHAR(255),
    expiry_date DATE,
    batch_number VARCHAR(100),
    
    -- 7. Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- 8. Lifecycle & Audit (System Managed)
    created_by INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX idx_inventory_item_code ON inventory(item_code);
CREATE INDEX idx_inventory_item_name ON inventory(item_name);
CREATE INDEX idx_inventory_category ON inventory(category);
CREATE INDEX idx_inventory_is_active ON inventory(is_active);
CREATE INDEX idx_inventory_quantity ON inventory(quantity);
CREATE INDEX idx_inventory_expiry_date ON inventory(expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX idx_inventory_created_at ON inventory(created_at DESC);
CREATE INDEX idx_inventory_low_stock ON inventory(quantity, reorder_level) WHERE quantity <= reorder_level;

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_inventory_timestamp
    BEFORE UPDATE ON inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_updated_at();

-- Comments for documentation
COMMENT ON TABLE inventory IS 'Stores inventory items for inventory management';
COMMENT ON COLUMN inventory.id IS 'Auto-incrementing integer primary key';
COMMENT ON COLUMN inventory.item_code IS 'Unique code for the inventory item';
COMMENT ON COLUMN inventory.item_name IS 'Name of the inventory item';
COMMENT ON COLUMN inventory.description IS 'Description of the inventory item';
COMMENT ON COLUMN inventory.category IS 'Category of the inventory item';
COMMENT ON COLUMN inventory.quantity IS 'Current quantity in stock';
COMMENT ON COLUMN inventory.unit_of_measure IS 'Unit of measurement (e.g., pieces, boxes, kg)';
COMMENT ON COLUMN inventory.reorder_level IS 'Minimum quantity before reorder is needed';
COMMENT ON COLUMN inventory.unit_price IS 'Price per unit';
COMMENT ON COLUMN inventory.supplier_name IS 'Name of the supplier';
COMMENT ON COLUMN inventory.supplier_contact IS 'Contact information for the supplier';
COMMENT ON COLUMN inventory.location IS 'Storage location of the item';
COMMENT ON COLUMN inventory.expiry_date IS 'Expiry date of the item (if applicable)';
COMMENT ON COLUMN inventory.batch_number IS 'Batch or lot number for tracking';
COMMENT ON COLUMN inventory.is_active IS 'Whether the inventory item is currently active';
COMMENT ON COLUMN inventory.created_by IS 'User ID that created this inventory item';
COMMENT ON COLUMN inventory.created_at IS 'Timestamp when the inventory item was created';
COMMENT ON COLUMN inventory.updated_by IS 'User ID that last updated this inventory item';
COMMENT ON COLUMN inventory.updated_at IS 'Timestamp when the inventory item was last updated';
