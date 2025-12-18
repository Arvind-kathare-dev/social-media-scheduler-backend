-- ============================================
-- COMPLETE DATABASE SETUP SCRIPT
-- Project: Ordina Backend
-- Description: Creates all tables in correct order
-- ============================================

-- ============================================
-- 1. AGENCIES TABLE (Must be first - referenced by others)
-- ============================================

CREATE TABLE IF NOT EXISTS agencies (
    id SERIAL PRIMARY KEY,
    agency_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    contact_no VARCHAR(20),
    date_of_birth DATE,
    agency_no VARCHAR(100) UNIQUE,
    license_no VARCHAR(100),
    hospital_name VARCHAR(255),
    sign_threshold DECIMAL(10, 2),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Staff' CHECK (role IN ('Staff', 'Admin', 'Manager', 'Supervisor')),
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_agencies_email ON agencies(email);
CREATE INDEX idx_agencies_agency_no ON agencies(agency_no);
CREATE INDEX idx_agencies_is_active ON agencies(is_active);

CREATE OR REPLACE FUNCTION update_agencies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_agencies_timestamp
    BEFORE UPDATE ON agencies
    FOR EACH ROW
    EXECUTE FUNCTION update_agencies_updated_at();

-- ============================================
-- 2. ORDER STATES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS order_states (
    id SERIAL PRIMARY KEY,
    state_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by INT REFERENCES agencies(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by INT REFERENCES agencies(id) ON DELETE SET NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_states_state_name ON order_states(state_name);
CREATE INDEX idx_order_states_is_active ON order_states(is_active);

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

-- ============================================
-- 3. ORDER TYPES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS order_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by INT REFERENCES agencies(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by INT REFERENCES agencies(id) ON DELETE SET NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_types_type_name ON order_types(type_name);
CREATE INDEX idx_order_types_is_active ON order_types(is_active);

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

-- ============================================
-- 4. PHYSICIANS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS physicians (
    physician_id SERIAL PRIMARY KEY,
    agency_id INT NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    physician_type VARCHAR(20) NOT NULL CHECK (physician_type IN ('agency_owned', 'external')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200),
    primary_email VARCHAR(255) NOT NULL,
    secondary_email VARCHAR(255),
    phone_number VARCHAR(20),
    fax_number VARCHAR(20),
    preferred_contact_method VARCHAR(20) DEFAULT 'ordina' CHECK (preferred_contact_method IN ('ordina', 'email', 'fax', 'erp')),
    login_enabled BOOLEAN DEFAULT true,
    login_email VARCHAR(255),
    role VARCHAR(20) DEFAULT 'physician' CHECK (role IN ('physician')),
    account_status VARCHAR(20) CHECK (account_status IN ('invited', 'active', 'suspended')),
    last_login_at TIMESTAMP,
    specialty JSONB DEFAULT '[]'::jsonb,
    department VARCHAR(100),
    tags JSONB DEFAULT '[]'::jsonb,
    internal_notes TEXT,
    npi_number VARCHAR(10),
    npi_source VARCHAR(20) CHECK (npi_source IN ('agency', 'erp', 'external')),
    pecos_id VARCHAR(50),
    pecos_status VARCHAR(20) CHECK (pecos_status IN ('enrolled', 'pending', 'unknown')),
    pecos_source VARCHAR(20) CHECK (pecos_source IN ('agency', 'erp')),
    default_delivery_method VARCHAR(20) CHECK (default_delivery_method IN ('ordina', 'fax', 'email', 'erp')),
    auto_notify BOOLEAN DEFAULT true,
    reminder_enabled BOOLEAN DEFAULT true,
    preferred_sla VARCHAR(20),
    created_by INT REFERENCES agencies(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by INT REFERENCES agencies(id) ON DELETE SET NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deactivated_by INT REFERENCES agencies(id) ON DELETE SET NULL,
    deactivated_at TIMESTAMP,
    deactivation_reason TEXT,
    CONSTRAINT unique_physician_email_per_agency UNIQUE (agency_id, primary_email),
    CONSTRAINT unique_npi_number UNIQUE (npi_number)
);

CREATE INDEX idx_physicians_agency_id ON physicians(agency_id);
CREATE INDEX idx_physicians_status ON physicians(status);
CREATE INDEX idx_physicians_primary_email ON physicians(primary_email);

CREATE OR REPLACE FUNCTION update_physicians_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_physicians_timestamp
    BEFORE UPDATE ON physicians
    FOR EACH ROW
    EXECUTE FUNCTION update_physicians_updated_at();

-- ============================================
-- 5. INVENTORY TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    current_stock DECIMAL(10, 2) NOT NULL DEFAULT 0,
    last_restock DATE,
    cost_per_unit DECIMAL(10, 2),
    total_stock_value DECIMAL(15, 2) GENERATED ALWAYS AS (current_stock * cost_per_unit) STORED,
    supply_status VARCHAR(50) DEFAULT 'Active' CHECK (supply_status IN ('Active', 'Discontinued', 'Out of Stock', 'Low Stock')),
    created_by INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_sku ON inventory(sku);
CREATE INDEX idx_inventory_item_name ON inventory(item_name);
CREATE INDEX idx_inventory_supply_status ON inventory(supply_status);

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

-- ============================================
-- 6. SUPPLIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS supplies (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    clinician_name VARCHAR(255) NOT NULL,
    items TEXT NOT NULL,
    total_items INT NOT NULL DEFAULT 0,
    order_date DATE NOT NULL,
    insurance_type VARCHAR(100),
    is_approve BOOLEAN DEFAULT FALSE,
    is_decline BOOLEAN DEFAULT FALSE,
    delivered_date DATE DEFAULT NULL,
    created_by INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_supplies_order_id ON supplies(order_id);
CREATE INDEX idx_supplies_patient_name ON supplies(patient_name);
CREATE INDEX idx_supplies_order_date ON supplies(order_date DESC);

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

-- ============================================
-- SETUP COMPLETE
-- ============================================

-- Insert default order states
INSERT INTO order_states (state_name, description, is_active) VALUES
('Draft', 'Order is being created', true),
('Pending', 'Order is pending approval', true),
('Approved', 'Order has been approved', true),
('In Progress', 'Order is being processed', true),
('Completed', 'Order has been completed', true),
('Cancelled', 'Order has been cancelled', true)
ON CONFLICT (state_name) DO NOTHING;

-- Insert default order types
INSERT INTO order_types (type_name, description, is_active) VALUES
('Medical Supply', 'Medical supply order', true),
('Equipment', 'Medical equipment order', true),
('Medication', 'Medication order', true),
('Lab Test', 'Laboratory test order', true)
ON CONFLICT (type_name) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ All tables created successfully!';
    RAISE NOTICE '✅ Default order states and types inserted!';
    RAISE NOTICE '✅ Database setup complete!';
END $$;
