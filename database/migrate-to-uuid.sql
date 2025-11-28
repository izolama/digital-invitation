-- Migration Script: Convert ID to UUID
-- Run this script to convert existing database to use UUID

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 1: Add new UUID column to registrations
ALTER TABLE registrations ADD COLUMN uuid_id UUID DEFAULT gen_random_uuid();

-- Step 2: Populate UUID for existing records
UPDATE registrations SET uuid_id = gen_random_uuid() WHERE uuid_id IS NULL;

-- Step 3: Make UUID column NOT NULL
ALTER TABLE registrations ALTER COLUMN uuid_id SET NOT NULL;

-- Step 4: Create unique index on UUID
CREATE UNIQUE INDEX idx_registrations_uuid ON registrations(uuid_id);

-- Step 5: Drop old primary key constraint
ALTER TABLE registrations DROP CONSTRAINT registrations_pkey;

-- Step 6: Drop old id column
ALTER TABLE registrations DROP COLUMN id;

-- Step 7: Rename uuid_id to id
ALTER TABLE registrations RENAME COLUMN uuid_id TO id;

-- Step 8: Add primary key constraint
ALTER TABLE registrations ADD PRIMARY KEY (id);

-- Step 9: Update indexes (recreate with UUID)
DROP INDEX IF EXISTS idx_registrations_email;
CREATE INDEX idx_registrations_email ON registrations(email);

-- Done!
SELECT 'Migration to UUID completed successfully!' as status;
SELECT 'Total registrations: ' || COUNT(*) as count FROM registrations;

