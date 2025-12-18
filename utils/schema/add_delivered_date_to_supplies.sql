-- Add delivered_date column to existing supplies table
-- This is a migration script to add the delivered_date field

-- Add the delivered_date column
ALTER TABLE supplies 
ADD COLUMN IF NOT EXISTS delivered_date DATE DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN supplies.delivered_date IS 'Date when the supply order was delivered (optional)';

-- Add index for performance optimization
CREATE INDEX IF NOT EXISTS idx_supplies_delivered_date ON supplies(delivered_date) WHERE delivered_date IS NOT NULL;
