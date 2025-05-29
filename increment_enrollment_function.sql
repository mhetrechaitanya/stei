CREATE OR REPLACE FUNCTION increment_enrollment(p_batch_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE batches
  SET enrolled = COALESCE(enrolled, 0) + 1
  WHERE id = p_batch_id;
END;
$$ LANGUAGE plpgsql;
