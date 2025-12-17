# Ordina - Database Schema

## Overview

This document defines the PostgreSQL database schema for the Physician and Agency Workflow modules based on the Product Requirements Documents (PRDs).

---

## Database Tables

### 1. users

Stores physician and other user information.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'physician',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**

- `id`: Primary key
- `name`: Full name of the user
- `email`: Unique email address
- `password`: Hashed password
- `role`: User role (physician, admin, etc.)
- `is_active`: Account status
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

---

### 2. patients

Patient master data.

```sql
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dob DATE,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    address TEXT,
    medical_record_number VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**

- `id`: Primary key
- `name`: Patient full name
- `dob`: Date of birth
- `contact_phone`: Contact phone number
- `contact_email`: Contact email
- `address`: Physical address
- `medical_record_number`: Unique medical record identifier
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

---

### 3. agencies

Service agencies that create and manage orders.

```sql
CREATE TABLE agencies (
    id SERIAL PRIMARY KEY,
    agency_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    contact_no VARCHAR(20),
    date_of_birth DATE,
    agency_no VARCHAR(100) UNIQUE,
    license_no VARCHAR(100),
    hospital_name VARCHAR(255),
    sign_threshold VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'Staff' CHECK (role IN ('Admin', 'Staff')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    updated_by INT REFERENCES users(id) ON DELETE SET NULL
);
```

**Fields:**

- `id`: Primary key
- `agency_name`: Agency name
- `email`: Unique email address for login
- `password`: Hashed password for authentication
- `role`: User role within agency (Admin or Staff) - default: Staff
- `contact_no`: Contact phone number
- `date_of_birth`: Date of birth
- `agency_no`: Unique agency number
- `license_no`: License number
- `hospital_name`: Associated hospital name
- `sign_threshold`: Signature threshold (e.g., "2 Days")
- `is_active`: Active status
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp
- `created_by`: User who created the agency
- `updated_by`: User who last updated the agency

---

### 4. order_types

Reference table for order types.

```sql
CREATE TABLE order_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**

- `id`: Primary key
- `type_name`: Order type (medication, therapy, equipment, etc.)
- `description`: Detailed description
- `is_active`: Active status
- `created_at`: Record creation timestamp

**Sample Data:**

- Medication
- Therapy
- Equipment
- Lab Test
- Imaging

---

### 5. order_states

Reference table for valid order states.

```sql
CREATE TABLE order_states (
    id SERIAL PRIMARY KEY,
    state_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    display_order INT,
    is_internal BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**

- `id`: Primary key
- `state_name`: State name
- `description`: State description
- `display_order`: Order for UI display
- `is_internal`: Whether state applies to internal physicians (true) or external (false)
- `created_at`: Record creation timestamp

**Sample Data:**

Internal States:

- Unopened
- Unsigned
- Signed
- Rejected
- Undelivered
- Reopen
- Draft

External States:

- Sent (External)
- Signed (External)
- Rejected (External)

---

### 6. physicians

Physician information for both agency-owned and external physicians.

```sql
CREATE TABLE physicians (
    id SERIAL PRIMARY KEY,
    physician_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    agency_id INT NOT NULL REFERENCES agencies(id) ON DELETE RESTRICT,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    physician_type VARCHAR(20) NOT NULL CHECK (physician_type IN ('agency_owned', 'external')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),

    -- Identity
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),

    -- Contact Information
    primary_email VARCHAR(255),
    secondary_email VARCHAR(255),
    phone_number VARCHAR(20),
    fax_number VARCHAR(50),
    preferred_contact_method VARCHAR(20) CHECK (preferred_contact_method IN ('ordina', 'email', 'fax', 'erp')),

    -- Access & Login (Agency-Owned Only)
    login_enabled BOOLEAN DEFAULT false,
    login_email VARCHAR(255),
    role VARCHAR(50) DEFAULT 'physician',
    account_status VARCHAR(20) CHECK (account_status IN ('invited', 'active', 'suspended')),
    last_login_at TIMESTAMP,

    -- Professional Metadata
    specialty TEXT[],
    department VARCHAR(255),
    tags TEXT[],
    internal_notes TEXT,

    -- Healthcare Identifiers
    npi_number VARCHAR(10),
    npi_source VARCHAR(20) CHECK (npi_source IN ('agency', 'erp', 'external')),
    pecos_id VARCHAR(255),
    pecos_status VARCHAR(20) CHECK (pecos_status IN ('enrolled', 'pending', 'unknown')),
    pecos_source VARCHAR(20) CHECK (pecos_source IN ('agency', 'erp')),

    -- Order Routing & Preferences
    default_delivery_method VARCHAR(20) CHECK (default_delivery_method IN ('ordina', 'fax', 'email', 'erp')),
    auto_notify BOOLEAN DEFAULT true,
    reminder_enabled BOOLEAN DEFAULT true,
    preferred_sla VARCHAR(20),

    -- Lifecycle & Audit
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deactivated_by INT REFERENCES users(id) ON DELETE SET NULL,
    deactivated_at TIMESTAMP,
    deactivation_reason TEXT
);
```

**Fields:**

- `id`: Primary key
- `physician_id`: System-generated UUID
- `agency_id`: Foreign key to agencies table
- `user_id`: Foreign key to users table (for agency-owned physicians with login)
- `physician_type`: Type of physician (agency_owned or external)
- `status`: Active status
- `first_name`, `last_name`, `display_name`: Identity fields
- `primary_email`, `secondary_email`, `phone_number`, `fax_number`: Contact information
- `preferred_contact_method`: Preferred method for order delivery
- `login_enabled`, `login_email`, `role`, `account_status`, `last_login_at`: Login fields (agency-owned only)
- `specialty`, `department`, `tags`, `internal_notes`: Professional metadata
- `npi_number`, `npi_source`, `pecos_id`, `pecos_status`, `pecos_source`: Healthcare identifiers
- `default_delivery_method`, `auto_notify`, `reminder_enabled`, `preferred_sla`: Order routing preferences
- `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
- `deactivated_by`, `deactivated_at`, `deactivation_reason`: Deactivation tracking

**Indexes:**

```sql
CREATE INDEX idx_physicians_agency ON physicians(agency_id);
CREATE INDEX idx_physicians_user ON physicians(user_id);
CREATE INDEX idx_physicians_type ON physicians(physician_type);
CREATE INDEX idx_physicians_status ON physicians(status);
CREATE INDEX idx_physicians_email ON physicians(primary_email);
```

---

### 7. orders

Main orders table - core entity.

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    physician_id INT NOT NULL REFERENCES physicians(id) ON DELETE RESTRICT,
    order_type_id INT NOT NULL REFERENCES order_types(id) ON DELETE RESTRICT,
    agency_id INT NOT NULL REFERENCES agencies(id) ON DELETE RESTRICT,
    service_type VARCHAR(100),
    source VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL DEFAULT 'Draft',
    clinical_instructions TEXT,
    notes TEXT,
    delivery_method VARCHAR(20) CHECK (delivery_method IN ('ordina', 'fax', 'email', 'erp')),
    external_tracking_id VARCHAR(255),

    -- Timestamps
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP,
    viewed_at TIMESTAMP,
    signed_at TIMESTAMP,
    signed_by INT REFERENCES users(id) ON DELETE SET NULL,
    rejected_at TIMESTAMP,
    rejected_by INT REFERENCES users(id) ON DELETE SET NULL,
    delivered_at TIMESTAMP,

    -- External physician tracking
    sent_external_at TIMESTAMP,
    signed_external_at TIMESTAMP,
    rejected_external_at TIMESTAMP,
    external_signature_verified BOOLEAN DEFAULT false,
    external_signature_method VARCHAR(50)
);
```

**Fields:**

- `id`: Primary key
- `patient_id`: Foreign key to patients table
- `physician_id`: Foreign key to physicians table (assigned physician)
- `order_type_id`: Foreign key to order_types table
- `agency_id`: Foreign key to agencies table (required - agency that created the order)
- `service_type`: Type of service
- `source`: Order source (manual, agency, email, fax, ERP)
- `state`: Current order state (Draft, Unopened, Unsigned, Signed, Rejected, Sent (External), Signed (External), Rejected (External), Delivered)
- `clinical_instructions`: Clinical instructions for the order
- `notes`: Additional notes
- `delivery_method`: Method for delivering order to physician
- `external_tracking_id`: Tracking ID for external delivery (fax confirmation, email ID, etc.)
- `created_by`: User who created the order
- `created_at`: Order creation timestamp
- `updated_at`: Last update timestamp
- `submitted_at`: When order was submitted from Draft
- `viewed_at`: When order was first viewed (internal physicians)
- `signed_at`: When order was signed (internal physicians)
- `signed_by`: Who signed the order (internal physicians)
- `rejected_at`: When order was rejected (internal physicians)
- `rejected_by`: Who rejected the order (internal physicians)
- `delivered_at`: When order was delivered
- `sent_external_at`: When order was sent to external physician
- `signed_external_at`: When external physician signed (manually updated by agency)
- `rejected_external_at`: When external physician rejected (manually updated by agency)
- `external_signature_verified`: Whether external signature was verified
- `external_signature_method`: Method used for external signature (fax, email, etc.)

**Indexes:**

```sql
CREATE INDEX idx_orders_patient ON orders(patient_id);
CREATE INDEX idx_orders_physician ON orders(physician_id);
CREATE INDEX idx_orders_agency ON orders(agency_id);
CREATE INDEX idx_orders_state ON orders(state);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_submitted_at ON orders(submitted_at);
```

---

### 8. order_history

Tracks all state transitions and changes.

```sql
CREATE TABLE order_history (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    from_state VARCHAR(50),
    to_state VARCHAR(50) NOT NULL,
    changed_by INT REFERENCES users(id) ON DELETE SET NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    metadata JSONB
);
```

**Fields:**

- `id`: Primary key
- `order_id`: Foreign key to orders table
- `from_state`: Previous state
- `to_state`: New state
- `changed_by`: User who made the change
- `changed_at`: When the change occurred
- `notes`: Additional notes about the change
- `metadata`: Additional JSON data for flexibility

**Indexes:**

```sql
CREATE INDEX idx_order_history_order ON order_history(order_id);
CREATE INDEX idx_order_history_changed_at ON order_history(changed_at);
```

---

### 9. order_actions

Tracks all actions performed on orders by agency staff.

```sql
CREATE TABLE order_actions (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    performed_by INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    from_physician_id INT REFERENCES physicians(id) ON DELETE SET NULL,
    to_physician_id INT REFERENCES physicians(id) ON DELETE SET NULL,
    notes TEXT,
    metadata JSONB
);
```

**Fields:**

- `id`: Primary key
- `order_id`: Foreign key to orders table
- `action_type`: Type of action (edit, reassign, cancel, clone, deliver, etc.)
- `performed_by`: User who performed the action
- `performed_at`: When the action occurred
- `from_physician_id`: Previous physician (for reassignment)
- `to_physician_id`: New physician (for reassignment)
- `notes`: Additional notes about the action
- `metadata`: Additional JSON data for flexibility

**Indexes:**

```sql
CREATE INDEX idx_order_actions_order ON order_actions(order_id);
CREATE INDEX idx_order_actions_type ON order_actions(action_type);
CREATE INDEX idx_order_actions_performed_at ON order_actions(performed_at);
```

---

### 10. order_attachments

Supporting documents for orders.

```sql
CREATE TABLE order_attachments (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size INT,
    uploaded_by INT REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);
```

**Fields:**

- `id`: Primary key
- `order_id`: Foreign key to orders table
- `file_name`: Original file name
- `file_path`: Storage path or URL
- `file_type`: MIME type or file extension
- `file_size`: File size in bytes
- `uploaded_by`: User who uploaded the file
- `uploaded_at`: Upload timestamp
- `description`: File description

**Indexes:**

```sql
CREATE INDEX idx_attachments_order ON order_attachments(order_id);
```

---

### 11. order_rejections

Rejection reasons and details.

```sql
CREATE TABLE order_rejections (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    rejected_by INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    rejection_reason TEXT NOT NULL,
    rejection_category VARCHAR(100),
    rejected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    additional_notes TEXT
);
```

**Fields:**

- `id`: Primary key
- `order_id`: Foreign key to orders table
- `rejected_by`: User who rejected the order
- `rejection_reason`: Detailed reason for rejection
- `rejection_category`: Category of rejection (clinical, administrative, etc.)
- `rejected_at`: Rejection timestamp
- `additional_notes`: Additional notes

**Indexes:**

```sql
CREATE INDEX idx_rejections_order ON order_rejections(order_id);
```

---

### 12. notifications

User notifications for order events.

```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);
```

**Fields:**

- `id`: Primary key
- `user_id`: Foreign key to users table
- `order_id`: Related order (optional)
- `notification_type`: Type of notification (new_order, state_change, etc.)
- `title`: Notification title
- `message`: Notification message
- `is_read`: Read status
- `read_at`: When notification was read
- `created_at`: Notification creation timestamp
- `metadata`: Additional JSON data

**Indexes:**

```sql
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
```

---

### 13. erp_imports

Track ERP import sources and status.

```sql
CREATE TABLE erp_imports (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE SET NULL,
    erp_source VARCHAR(100) NOT NULL,
    external_order_id VARCHAR(255),
    import_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    import_data JSONB,
    error_message TEXT,
    processed_at TIMESTAMP
);
```

**Fields:**

- `id`: Primary key
- `order_id`: Foreign key to orders table (after successful import)
- `erp_source`: Source ERP system (Symmetry, etc.)
- `external_order_id`: Order ID in the external system
- `import_status`: Import status (pending, success, failed)
- `imported_at`: Import timestamp
- `import_data`: Raw import data in JSON format
- `error_message`: Error message if import failed
- `processed_at`: When import was processed

**Indexes:**

```sql
CREATE INDEX idx_erp_imports_order ON erp_imports(order_id);
CREATE INDEX idx_erp_imports_status ON erp_imports(import_status);
CREATE INDEX idx_erp_imports_source ON erp_imports(erp_source);
```

---

## State Transition Rules

### Internal Physician Flow (Agency-Owned):

1. **Draft → Unopened**: When agency submits order
2. **Unopened → Unsigned**: When physician views order
3. **Unsigned → Signed**: When physician signs
4. **Unsigned → Rejected**: When physician rejects
5. **Signed → Delivered**: When agency marks as delivered
6. **Rejected → Draft**: When agency clones rejected order

### External Physician Flow:

1. **Draft → Sent (External)**: When agency submits order to external physician
2. **Sent (External) → Signed (External)**: When agency manually updates after receiving signed document
3. **Sent (External) → Rejected (External)**: When agency manually updates after receiving rejection
4. **Signed (External) → Delivered**: When agency marks as delivered
5. **Rejected (External) → Draft**: When agency clones rejected order

### Agency Actions by State:

- **Draft**: Edit, Delete, Submit
- **Unopened/Unsigned**: Edit, Reassign, Cancel
- **Sent (External)**: Edit, Reassign, Update Status (to Signed/Rejected External)
- **Signed/Signed (External)**: Deliver
- **Rejected/Rejected (External)**: Clone, Reassign
- **Delivered**: View only (read-only)

### Restrictions:

- Backward transitions are not allowed (except clone operations)
- Rejected orders cannot be modified (must be cloned)
- Signed orders are read-only (except for delivery action)
- Delivered orders are completely read-only

---

## Summary

**Total Tables: 13**

### Core Tables (7):

1. users
2. patients
3. agencies
4. physicians
5. orders
6. order_history
7. order_actions

### Supporting Tables (6):

8. order_attachments
9. order_rejections
10. notifications
11. order_types
12. order_states
13. erp_imports

---

## Key Design Decisions

### Physician Management:

- Physicians are scoped to agencies (agency_id is required)
- Agency-owned physicians can have Ordina login (user_id link)
- External physicians do not have login credentials
- All physician metadata is stored in the physicians table
- Healthcare identifiers (NPI, PECOS) are optional and non-validating in v1

### Order Workflow:

- All orders must be associated with an agency
- Orders reference physicians table (not users table directly)
- State transitions differ based on physician type (internal vs external)
- External physician signing is manually updated by agency staff in v1
- Draft state allows agencies to save incomplete orders

### Audit & Tracking:

- order_history tracks state transitions
- order_actions tracks agency actions (edit, reassign, cancel, clone, deliver)
- All tables include created_by, updated_by for audit trail
- Timestamps track key events (viewed, signed, rejected, delivered)

### Flexibility:

- JSONB fields (metadata, settings) provide extensibility
- Array fields (specialty, tags) support multi-select
- Delivery methods support multiple channels (ordina, fax, email, erp)

## Notes

- All timestamps use `TIMESTAMP` type with default `CURRENT_TIMESTAMP`
- Foreign keys use appropriate `ON DELETE` actions based on business logic
- Indexes are created on frequently queried columns
- JSONB fields provide flexibility for future extensions
- State transitions should be enforced at application level with validation
- External signature verification is a placeholder for future enhancement
- SLA tracking and enforcement to be implemented in future versions
