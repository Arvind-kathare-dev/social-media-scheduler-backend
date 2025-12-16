-- Fix the column types for created_at and updated_at in agencies table

-- Drop the incorrect columns
ALTER TABLE agencies 
DROP COLUMN IF EXISTS created_at;

ALTER TABLE agencies 
DROP COLUMN IF EXISTS updated_at;

-- Add them back with correct type
ALTER TABLE agencies 
ADD COLUMN created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE agencies 
ADD COLUMN updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Verify the changes
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'agencies' 
AND column_name IN ('created_at', 'updated_at');

-- Show all agencies
SELECT * FROM agencies;
