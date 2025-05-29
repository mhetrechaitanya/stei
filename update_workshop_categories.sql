-- Update existing workshops with the new categories
UPDATE workshops
SET category = CASE 
  WHEN id % 3 = 0 THEN 'iACE Series'
  WHEN id % 3 = 1 THEN 'Self-growth'
  WHEN id % 3 = 2 THEN 'The Strength of She'
  ELSE NULL
END
WHERE category IS NULL OR category = '';
