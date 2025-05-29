-- Create a function to check RLS status
CREATE OR REPLACE FUNCTION check_rls_status()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  workshops_rls boolean;
  batches_rls boolean;
  result json;
BEGIN
  -- Check if RLS is enabled for workshops table
  SELECT rls_enabled INTO workshops_rls
  FROM pg_tables
  WHERE schemaname = 'public' AND tablename = 'workshops';
  
  -- Check if RLS is enabled for workshop_batches table
  SELECT rls_enabled INTO batches_rls
  FROM pg_tables
  WHERE schemaname = 'public' AND tablename = 'workshop_batches';
  
  -- Create result JSON
  result := json_build_object(
    'workshops_rls_enabled', workshops_rls,
    'workshop_batches_rls_enabled', batches_rls
  );
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$;
