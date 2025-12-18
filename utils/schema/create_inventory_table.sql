-- Inventory Table Creation Script
-- Module: Inventory Management
-- Status: Final & Locked for v1

CREATE TABLE IF NOT EXISTS inventory (
    -- 1. System & Identity (Core – Mandatory)
    id SERIAL PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    
    -- 2. Basic Information (Mandatory)
    item_name VARCHAR(255) NOT NULL,
    
    -- 3. Stock & Quantity
    current_stock DECIMAL(10, 2) NOT NULL DEFAULT 0,
    last_restock DATE,
    
    -- 4. Pricing & Value
    cost_per_unit DECIMAL(10, 2),
    total_stock_value DECIMAL(15, 2) GENERATED ALWAYS AS (current_stock * cost_per_unit) STORED,
    
    -- 5. Status
    supply_status VARCHAR(50) DEFAULT 'Active' CHECK (supply_status IN ('Active', 'Discontinued', 'Out of Stock', 'Low Stock')),
    
    -- 6. Lifecycle & Audit (System Managed)
    created_by INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX idx_inventory_sku ON inventory(sku);
CREATE INDEX idx_inventory_item_name ON inventory(item_name);
CREATE INDEX idx_inventory_current_stock ON inventory(current_stock);
CREATE INDEX idx_inventory_supply_status ON inventory(supply_status);
CREATE INDEX idx_inventory_last_restock ON inventory(last_restock) WHERE last_restock IS NOT NULL;
CREATE INDEX idx_inventory_created_at ON inventory(created_at DESC);

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
COMMENT ON COLUMN inventory.sku IS 'Unique SKU (Stock Keeping Unit) for the inventory item';
COMMENT ON COLUMN inventory.item_name IS 'Name of the inventory item';
COMMENT ON COLUMN inventory.current_stock IS 'Current quantity in stock';
COMMENT ON COLUMN inventory.last_restock IS 'Date of last restock';
COMMENT ON COLUMN inventory.cost_per_unit IS 'Cost per unit';
COMMENT ON COLUMN inventory.total_stock_value IS 'Total stock value (calculated: current_stock * cost_per_unit)';
COMMENT ON COLUMN inventory.supply_status IS 'Supply status: Active, Discontinued, Out of Stock, Low Stock';
COMMENT ON COLUMN inventory.created_by IS 'User ID that created this inventory item';
COMMENT ON COLUMN inventory.created_at IS 'Timestamp when the inventory item was created';
COMMENT ON COLUMN inventory.updated_by IS 'User ID that last updated this inventory item';
COMMENT ON COLUMN inventory.updated_at IS 'Timestamp when the inventory item was last updated';
