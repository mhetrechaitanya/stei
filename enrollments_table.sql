-- Create enrollments table for workshop enrollment management
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  batch_id UUID NOT NULL,
  workshop_id UUID,
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_status TEXT DEFAULT 'completed',
  transaction_id TEXT,
  order_id TEXT,
  amount NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, batch_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_batch_id ON enrollments(batch_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_workshop_id ON enrollments(workshop_id);

-- Create exec_sql function if it doesn't exist
CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$; 