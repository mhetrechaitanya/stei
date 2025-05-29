-- Ensure consistent casing in SQL scripts
-- Create extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop the table if it exists but has wrong structure
DROP TABLE IF EXISTS students;

-- Create students table with correct structure
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  pincode TEXT,
  workshop_id UUID,
  batch_id UUID,
  payment_status TEXT DEFAULT 'pending',
  amount NUMERIC DEFAULT 0,
  transaction_id TEXT,
  affiliate TEXT,
  order_id TEXT,
  payment_details JSONB,
  workshop_name TEXT,
  batch_date TIMESTAMP WITH TIME ZONE,
  batch_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_phone ON students(phone);
CREATE INDEX IF NOT EXISTS idx_students_workshop_id ON students(workshop_id);
CREATE INDEX IF NOT EXISTS idx_students_batch_id ON students(batch_id);

-- Insert a test record to verify the table works
INSERT INTO students (name, email, phone)
VALUES ('Test Student', 'test@example.com', '1234567890');

-- Verify the record was inserted
SELECT * FROM students WHERE email = 'test@example.com';
