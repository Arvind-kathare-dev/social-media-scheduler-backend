# Agency Table Creation Guide (GUI Tool)

## Step-by-Step Guide for Creating Agencies Table Using PostgreSQL GUI

This guide is specifically for creating the table using GUI tools like pgAdmin, DBeaver, or DataGrip.

---

## Table Name

```
agencies
```

---

## Columns Configuration

Add the following columns in order:

### Column 1: id

- **Name**: `id`
- **Data type**: `serial`
- **Length/Precision**: (leave empty)
- **Not NULL**: ✓ (checked)
- **Primary key**: ✓ (checked)
- **Default**: (leave empty)

---

### Column 2: agency_name

- **Name**: `agency_name`
- **Data type**: `character varying`
- **Length/Precision**: `255`
- **Not NULL**: ✓ (checked)
- **Primary key**: ☐ (unchecked)
- **Default**: (leave empty)

---

### Column 3: email

- **Name**: `email`
- **Data type**: `character varying`
- **Length/Precision**: `255`
- **Not NULL**: ✓ (checked)
- **Primary key**: ☐ (unchecked)
- **Unique**: ✓ (checked)
- **Default**: (leave empty)

---

### Column 4: contact_no

- **Name**: `contact_no`
- **Data type**: `character varying`
- **Length/Precision**: `20`
- **Not NULL**: ☐ (unchecked)
- **Primary key**: ☐ (unchecked)
- **Default**: (leave empty)

---

### Column 5: date_of_birth

- **Name**: `date_of_birth`
- **Data type**: `date`
- **Length/Precision**: (leave empty)
- **Not NULL**: ☐ (unchecked)
- **Primary key**: ☐ (unchecked)
- **Default**: (leave empty)

---

### Column 6: agency_no

- **Name**: `agency_no`
- **Data type**: `character varying`
- **Length/Precision**: `100`
- **Not NULL**: ☐ (unchecked)
- **Primary key**: ☐ (unchecked)
- **Unique**: ✓ (checked)
- **Default**: (leave empty)

---

### Column 7: license_no

- **Name**: `license_no`
- **Data type**: `character varying`
- **Length/Precision**: `100`
- **Not NULL**: ☐ (unchecked)
- **Primary key**: ☐ (unchecked)
- **Default**: (leave empty)

---

### Column 8: hospital_name

- **Name**: `hospital_name`
- **Data type**: `character varying`
- **Length/Precision**: `255`
- **Not NULL**: ☐ (unchecked)
- **Primary key**: ☐ (unchecked)
- **Default**: (leave empty)

---

### Column 9: sign_threshold

- **Name**: `sign_threshold`
- **Data type**: `character varying`
- **Length/Precision**: `50`
- **Not NULL**: ☐ (unchecked)
- **Primary key**: ☐ (unchecked)
- **Default**: (leave empty)

---

### Column 10: is_active

- **Name**: `is_active`
- **Data type**: `boolean`
- **Length/Precision**: (leave empty)
- **Not NULL**: ☐ (unchecked)
- **Primary key**: ☐ (unchecked)
- **Default**: `true`

---

### Column 11: password

- **Name**: `password`
- **Data type**: `character varying`
- **Length/Precision**: `255`
- **Not NULL**: ☐ (unchecked)
- **Primary key**: ☐ (unchecked)
- **Default**: (leave empty)

---

### Column 12: role

- **Name**: `role`
- **Data type**: `character varying`
- **Length/Precision**: `50`
- **Not NULL**: ☐ (unchecked)
- **Primary key**: ☐ (unchecked)
- **Default**: `'Staff'` (with single quotes)

---

### Column 13: created_by

- **Name**: `created_by`
- **Data type**: `integer`
- **Length/Precision**: (leave empty)
- **Not NULL**: ☐ (unchecked)
- **Primary key**: ☐ (unchecked)
- **Default**: (leave empty)

---

### Column 14: created_at

- **Name**: `created_at`
- **Data type**: `timestamp without time zone`
- **Length/Precision**: (leave empty)
- **Not NULL**: ☐ (unchecked)
- **Primary key**: ☐ (unchecked)
- **Default**: `CURRENT_TIMESTAMP`

---

### Column 15: updated_by

- **Name**: `updated_by`
- **Data type**: `integer`
- **Length/Precision**: (leave empty)
- **Not NULL**: ☐ (unchecked)
- **Primary key**: ☐ (unchecked)
- **Default**: (leave empty)

---

### Column 16: updated_at

- **Name**: `updated_at`
- **Data type**: `timestamp without time zone`
- **Length/Precision**: (leave empty)
- **Not NULL**: ☐ (unchecked)
- **Primary key**: ☐ (unchecked)
- **Default**: `CURRENT_TIMESTAMP`

---

## Quick Reference Table

| #   | Column Name    | Data Type                   | Length | Not NULL | Unique | Primary Key | Default           |
| --- | -------------- | --------------------------- | ------ | -------- | ------ | ----------- | ----------------- |
| 1   | id             | serial                      | -      | ✓        | -      | ✓           | -                 |
| 2   | agency_name    | character varying           | 255    | ✓        | -      | -           | -                 |
| 3   | email          | character varying           | 255    | ✓        | ✓      | -           | -                 |
| 4   | contact_no     | character varying           | 20     | -        | -      | -           | -                 |
| 5   | date_of_birth  | date                        | -      | -        | -      | -           | -                 |
| 6   | agency_no      | character varying           | 100    | -        | ✓      | -           | -                 |
| 7   | license_no     | character varying           | 100    | -        | -      | -           | -                 |
| 8   | hospital_name  | character varying           | 255    | -        | -      | -           | -                 |
| 9   | sign_threshold | character varying           | 50     | -        | -      | -           | -                 |
| 10  | is_active      | boolean                     | -      | -        | -      | -           | true              |
| 11  | password       | character varying           | 255    | -        | -      | -           | -                 |
| 12  | role           | character varying           | 50     | -        | -      | -           | 'Staff'           |
| 13  | created_by     | integer                     | -      | -        | -      | -           | -                 |
| 14  | created_at     | timestamp without time zone | -      | -        | -      | -           | CURRENT_TIMESTAMP |
| 15  | updated_by     | integer                     | -      | -        | -      | -           | -                 |
| 16  | updated_at     | timestamp without time zone | -      | -        | -      | -           | CURRENT_TIMESTAMP |

---

## Data Type Selection Guide

When you see the dropdown in your GUI tool, select these exact types:

### For Text Fields:

- Look for **"character varying"** or **"varchar"**
- Set the length in the Length/Precision field

### For Numbers:

- **"integer"** for whole numbers (created_by, updated_by)
- **"serial"** for auto-incrementing ID

### For True/False:

- **"boolean"** for is_active

### For Dates:

- **"date"** for date_of_birth

### For Timestamps:

- **"timestamp without time zone"** for created_at and updated_at

---

## After Creating the Table

### 1. Create Indexes (Run in SQL tab)

```sql
CREATE INDEX idx_agencies_email ON agencies(email);
CREATE INDEX idx_agencies_agency_no ON agencies(agency_no);
CREATE INDEX idx_agencies_is_active ON agencies(is_active);
CREATE INDEX idx_agencies_role ON agencies(role);
CREATE INDEX idx_agencies_hospital_name ON agencies(hospital_name);
CREATE INDEX idx_agencies_created_at ON agencies(created_at DESC);
```

### 2. Create Auto-Update Trigger (Run in SQL tab)

```sql
-- Create function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_agencies_updated_at
    BEFORE UPDATE ON agencies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 3. Add Role Constraint (Run in SQL tab)

```sql
ALTER TABLE agencies
ADD CONSTRAINT check_role
CHECK (role IN ('Admin', 'Staff'));
```

---

## Insert Test Data

After creating the table, insert a test agency:

```sql
INSERT INTO agencies (
    agency_name,
    email,
    contact_no,
    date_of_birth,
    agency_no,
    license_no,
    hospital_name,
    sign_threshold,
    is_active,
    password,
    role
) VALUES (
    'William Christiana',
    'william.christiana023@gmail.com',
    '+1-415-555-1023',
    '1998-03-25',
    'AG25MG01',
    'CA-458921',
    'SAN Francisco General Hospital',
    '2 Days',
    true,
    '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNO',
    'Admin'
);
```

**Note**: Replace the password hash with a real bcrypt hash. To generate one:

```javascript
// Run in Node.js
const bcrypt = require("bcrypt");
bcrypt.hash("your_password", 10, (err, hash) => {
  console.log(hash);
});
```

---

## Verification

After creating the table, verify it:

```sql
-- Check table structure
SELECT column_name, data_type, character_maximum_length, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'agencies'
ORDER BY ordinal_position;

-- Check if data was inserted
SELECT * FROM agencies;
```

---

## Common Issues

### Issue 1: "character varying" not in dropdown

- Try typing "varchar" or scroll down in the dropdown
- Some tools show it as "varchar" instead

### Issue 2: Default value not working

- Make sure to include quotes for string defaults: `'Staff'`
- For boolean, just type: `true` (no quotes)
- For timestamp, type: `CURRENT_TIMESTAMP` (no quotes)

### Issue 3: Serial type not available

- Look for "serial" or "serial4" in the dropdown
- Some tools might show it as "auto increment integer"

---

## Screenshot Reference

Based on your screenshot, here's what to do:

1. Click the **"+"** button to add a new column
2. In the **Name** field, type the column name (e.g., `agency_name`)
3. In the **Data type** dropdown, select `character varying`
4. In the **Length/Precision** field, type `255`
5. Check the **Not NULL** checkbox if required
6. Click **Save** button when done

---

**Table Creation Complete! 🎉**

Your agencies table is now ready to use with the Ordina backend application.
