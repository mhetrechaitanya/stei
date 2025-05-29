-- Ensure consistent casing in SQL scripts
-- Function to check if a table exists
CREATE OR REPLACE FUNCTION table_exists(table_name text) RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = table_name
    );
END;
$$ LANGUAGE plpgsql;

-- Create students table if it doesn't exist
DO $$
BEGIN
    IF NOT (SELECT table_exists('students')) THEN
        CREATE TABLE students (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT,
            first_name TEXT,
            last_name TEXT,
            email TEXT UNIQUE,
            phone TEXT UNIQUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            workshop_id UUID,
            batch_id UUID,
            enrollment_status TEXT DEFAULT 'registered',
            payment_status TEXT DEFAULT 'pending'
        );
        
        -- Create index for faster lookups
        CREATE INDEX idx_students_email ON students(email);
        CREATE INDEX idx_students_phone ON students(phone);
        
        RAISE NOTICE 'Students table created successfully';
    ELSE
        RAISE NOTICE 'Students table already exists';
    END IF;
END $$;
