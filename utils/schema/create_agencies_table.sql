-- Agencies Table Creation Script
-- Module: Agency Management
-- Status: Final & Locked for v1

CREATE TABLE IF NOT EXISTS agencies (
    -- 1. System & Identity (Core – Mandatory)
    id SERIAL PRIMARY KEY,
    
    -- 2. Basic Information (Mandatory)
    agency_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    contact_no VARCHAR(20),
    date_of_birth DATE,
    
    -- 3. Agency Identification
    agency_no VARCHAR(100) UNIQUE,
    license_no VARCHAR(100),
    
    -- 4. Hospital & Organization
    hospital_name VARCHAR(255),
    
    -- 5. Authorization & Threshold
    sign_threshold DECIMAL(10, 2),
    
    -- 6. Authentication
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Staff' CHECK (role IN ('Staff', 'Admin', 'Manager', 'Supervisor')),
    
    -- 7. Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- 8. Lifecycle & Audit (System Managed)
    created_by INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX idx_agencies_email ON agencies(email);
CREATE INDEX idx_agencies_agency_no ON agencies(agency_no);
CREATE INDEX idx_agencies_license_no ON agencies(license_no);
CREATE INDEX idx_agencies_hospital_name ON agencies(hospital_name);
CREATE INDEX idx_agencies_role ON agencies(role);
CREATE INDEX idx_agencies_is_active ON agencies(is_active);
CREATE INDEX idx_agencies_created_at ON agencies(created_at DESC);

-- Trigger to auto-update updated_at timestamp
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

-- Comments for documentation
COMMENT ON TABLE agencies IS 'Stores agency information for agency management';
COMMENT ON COLUMN agencies.id IS 'Auto-incrementing integer primary key';
COMMENT ON COLUMN agencies.agency_name IS 'Name of the agency';
COMMENT ON COLUMN agencies.email IS 'Unique email address for the agency';
COMMENT ON COLUMN agencies.contact_no IS 'Contact phone number';
COMMENT ON COLUMN agencies.date_of_birth IS 'Date of birth (if applicable)';
COMMENT ON COLUMN agencies.agency_no IS 'Unique agency identification number';
COMMENT ON COLUMN agencies.license_no IS 'License number for the agency';
COMMENT ON COLUMN agencies.hospital_name IS 'Associated hospital name';
COMMENT ON COLUMN agencies.sign_threshold IS 'Signature authorization threshold amount';
COMMENT ON COLUMN agencies.password IS 'Hashed password for authentication';
COMMENT ON COLUMN agencies.role IS 'User role: Staff, Admin, Manager, Supervisor';
COMMENT ON COLUMN agencies.is_active IS 'Active status (default: true)';
COMMENT ON COLUMN agencies.created_by IS 'User ID that created this agency record';
COMMENT ON COLUMN agencies.created_at IS 'Timestamp when the agency was created';
COMMENT ON COLUMN agencies.updated_by IS 'User ID that last updated this agency record';
COMMENT ON COLUMN agencies.updated_at IS 'Timestamp when the agency was last updated';
