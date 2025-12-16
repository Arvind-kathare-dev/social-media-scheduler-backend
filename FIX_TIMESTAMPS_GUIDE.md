# Fix Agency Timestamps Guide

## Issue

The `created_at` and `updated_at` fields are showing `null` because the database default values weren't set properly.

## Solution

### Option 1: Using pgAdmin or Database GUI

1. Open your PostgreSQL GUI tool (pgAdmin, DBeaver, etc.)
2. Connect to the `Ordina` database
3. Open the SQL query tool
4. Copy and paste the contents of `fix_agency_timestamps.sql`
5. Execute the script

### Option 2: Using psql Command Line

If you have psql installed and in your PATH:

```bash
psql -U postgres -d Ordina -f fix_agency_timestamps.sql
```

Or connect first, then run:

```bash
psql -U postgres -d Ordina
```

Then paste the SQL commands from `fix_agency_timestamps.sql`

### Option 3: Manual SQL Execution

Run these commands in your database:

```sql
-- Set defaults
ALTER TABLE agencies
ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE agencies
ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

-- Update existing NULL records
UPDATE agencies
SET created_at = CURRENT_TIMESTAMP
WHERE created_at IS NULL;

UPDATE agencies
SET updated_at = CURRENT_TIMESTAMP
WHERE updated_at IS NULL;
```

## Verification

After running the fix, test by creating a new agency:

```bash
curl --location 'http://localhost:8000/api/agencies' \
--header 'Content-Type: application/json' \
--data-raw '{
  "agency_name": "Test Agency",
  "email": "test@example.com",
  "password": "TestPass123!",
  "contact_no": "+1-555-0000",
  "role": "Staff"
}'
```

The response should now include proper timestamps:

```json
{
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

## What This Fixes

1. Sets `CURRENT_TIMESTAMP` as the default value for `created_at`
2. Sets `CURRENT_TIMESTAMP` as the default value for `updated_at`
3. Updates any existing records that have `NULL` timestamps
4. All future inserts will automatically get timestamps

## Note

The existing record (ID: 1) will also be updated with current timestamps. If you need to preserve the original creation time, you can manually set it after running the fix.
