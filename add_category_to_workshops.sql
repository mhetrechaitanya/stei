-- Check if the category column exists in the workshops table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'workshops'
        AND column_name = 'category'
    ) THEN
        -- Add the category column to the workshops table
        ALTER TABLE workshops ADD COLUMN category VARCHAR(100);
        
        -- Add an index on the category column for faster queries
        CREATE INDEX idx_workshops_category ON workshops(category);
    END IF;
END $$;
