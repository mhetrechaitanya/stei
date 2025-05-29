-- Create admin_user table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_user (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Check if admin user exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admin_user WHERE id = '2836daf3-59b2-4114-a2a2-dd1044b009d2') THEN
    -- Insert default admin user with the specified UUID
    INSERT INTO admin_user (id, email, password, name, role)
    VALUES ('2836daf3-59b2-4114-a2a2-dd1044b009d2', 'admin@stei.pro', 'admin123', 'Admin User', 'admin');
  END IF;
END
$$;

-- Create exec_sql function if it doesn't exist
CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE sql_query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
