-- Check if pincode column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'students' AND column_name = 'pincode') THEN
        ALTER TABLE students ADD COLUMN pincode VARCHAR(10);
    END IF;
END $$;

-- Check if address column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'students' AND column_name = 'address') THEN
        ALTER TABLE students ADD COLUMN address TEXT;
    END IF;
END $$;

-- Check if status column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'students' AND column_name = 'status') THEN
        ALTER TABLE students ADD COLUMN status VARCHAR(50);
    END IF;
END $$;
