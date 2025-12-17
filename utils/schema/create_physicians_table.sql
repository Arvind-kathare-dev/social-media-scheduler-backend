-- Physicians Table Creation Script
-- Module: Agency / Physician Management
-- Status: Final & Locked for v1

CREATE TABLE IF NOT EXISTS physicians (
    -- 1. System & Identity (Core – Mandatory)
    physician_id SERIAL PRIMARY KEY,
    agency_id INT NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    physician_type VARCHAR(20) NOT NULL CHECK (physician_type IN ('agency_owned', 'external')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    
    -- 2. Basic Information (Mandatory)
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200),
    
    -- 3. Contact Information
    primary_email VARCHAR(255) NOT NULL,
    secondary_email VARCHAR(255),
    phone_number VARCHAR(20),
    fax_number VARCHAR(20),
    preferred_contact_method VARCHAR(20) DEFAULT 'ordina' CHECK (preferred_contact_method IN ('ordina', 'email', 'fax', 'erp')),
    
    -- 4. Access & Login (Agency-Owned Only)
    login_enabled BOOLEAN DEFAULT true,
    login_email VARCHAR(255),
    role VARCHAR(20) DEFAULT 'physician' CHECK (role IN ('physician')),
    account_status VARCHAR(20) CHECK (account_status IN ('invited', 'active', 'suspended')),
    last_login_at TIMESTAMP,
    
    -- 5. Professional Metadata
    specialty JSONB DEFAULT '[]'::jsonb,
    department VARCHAR(100),
    tags JSONB DEFAULT '[]'::jsonb,
    internal_notes TEXT,
    
    -- 6. Healthcare Identifiers (Optional)
    npi_number VARCHAR(10),
    npi_source VARCHAR(20) CHECK (npi_source IN ('agency', 'erp', 'external')),
    pecos_id VARCHAR(50),
    pecos_status VARCHAR(20) CHECK (pecos_status IN ('enrolled', 'pending', 'unknown')),
    pecos_source VARCHAR(20) CHECK (pecos_source IN ('agency', 'erp')),
    
    -- 7. Order Routing & Preferences
    default_delivery_method VARCHAR(20) CHECK (default_delivery_method IN ('ordina', 'fax', 'email', 'erp')),
    auto_notify BOOLEAN DEFAULT true,
    reminder_enabled BOOLEAN DEFAULT true,
    preferred_sla VARCHAR(20),
    
    -- 8. Lifecycle & Audit (System Managed)
    created_by INT REFERENCES agencies(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by INT REFERENCES agencies(id) ON DELETE SET NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deactivated_by INT REFERENCES agencies(id) ON DELETE SET NULL,
    deactivated_at TIMESTAMP,
    deactivation_reason TEXT,
    
    -- Constraints
    CONSTRAINT unique_physician_email_per_agency UNIQUE (agency_id, primary_email),
    CONSTRAINT unique_npi_number UNIQUE (npi_number),
    CONSTRAINT check_login_email_when_enabled CHECK (
        (login_enabled = false) OR 
        (login_enabled = true AND login_email IS NOT NULL)
    ),
    CONSTRAINT check_fax_for_external CHECK (
        (physician_type = 'agency_owned') OR 
        (physician_type = 'external' AND preferred_contact_method = 'fax' AND fax_number IS NOT NULL) OR
        (physician_type = 'external' AND preferred_contact_method != 'fax')
    )
);

-- Indexes for performance optimization
CREATE INDEX idx_physicians_agency_id ON physicians(agency_id);
CREATE INDEX idx_physicians_status ON physicians(status);
CREATE INDEX idx_physicians_physician_type ON physicians(physician_type);
CREATE INDEX idx_physicians_primary_email ON physicians(primary_email);
CREATE INDEX idx_physicians_npi_number ON physicians(npi_number) WHERE npi_number IS NOT NULL;
CREATE INDEX idx_physicians_last_name ON physicians(last_name);
CREATE INDEX idx_physicians_created_at ON physicians(created_at DESC);
CREATE INDEX idx_physicians_specialty ON physicians USING GIN(specialty);
CREATE INDEX idx_physicians_tags ON physicians USING GIN(tags);

-- Trigger to auto-update updated_at timestamp
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

-- Comments for documentation
COMMENT ON TABLE physicians IS 'Stores physician information for agency and external physicians';
COMMENT ON COLUMN physicians.physician_id IS 'Auto-incrementing integer primary key';
COMMENT ON COLUMN physicians.agency_id IS 'Reference to parent agency';
COMMENT ON COLUMN physicians.physician_type IS 'Type: agency_owned or external';
COMMENT ON COLUMN physicians.status IS 'Current status: active or inactive';
COMMENT ON COLUMN physicians.login_enabled IS 'Whether physician can login (agency-owned only)';
COMMENT ON COLUMN physicians.specialty IS 'Multi-select array of specialties stored as JSONB';
COMMENT ON COLUMN physicians.tags IS 'Free-form tags stored as JSONB array';
COMMENT ON COLUMN physicians.npi_number IS 'National Provider Identifier (10 digits, optional)';
COMMENT ON COLUMN physicians.pecos_id IS 'US Medicare PECOS identifier';
COMMENT ON COLUMN physicians.preferred_sla IS 'Preferred SLA: 24h, 48h, or custom value';
COMMENT ON COLUMN physicians.last_login_at IS 'Read-only timestamp of last login';
COMMENT ON COLUMN physicians.created_by IS 'Agency ID that created this physician';
COMMENT ON COLUMN physicians.updated_by IS 'Agency ID that last updated this physician';
COMMENT ON COLUMN physicians.deactivated_by IS 'Agency ID that deactivated this physician';
