-- Add category column to workshops table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'workshops' 
        AND column_name = 'category'
    ) THEN
        ALTER TABLE workshops ADD COLUMN category TEXT;
    END IF;
END $$;
