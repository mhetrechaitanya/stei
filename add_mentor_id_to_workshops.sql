-- Add mentor_id column to workshops table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'workshops' 
        AND column_name = 'mentor_id'
    ) THEN
        -- Add mentor_id column
        ALTER TABLE workshops ADD COLUMN mentor_id UUID;
        
        -- Create index for faster lookups
        CREATE INDEX idx_workshops_mentor_id ON workshops(mentor_id);
        
        RAISE NOTICE 'Added mentor_id column to workshops table';
    ELSE
        RAISE NOTICE 'mentor_id column already exists in workshops table';
    END IF;
END $$;

-- Create mentors table if it doesn't exist
CREATE TABLE IF NOT EXISTS mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  image TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default mentor (Dr. Sandhya Tewari) if not exists
INSERT INTO mentors (name, title, bio, image, email) VALUES (
  'Dr. Sandhya Tewari',
  'PhD in Management, NLP Coach, Corporate Trainer',
  'Dr. Sandhya Tewari is a seasoned professional with over 30 years of experience in education, human resources, and personal development. A PhD holder in Management from PAHER University, Udaipur, and a Diploma recipient in Business Information from Alexander College, Perth, she brings a global perspective to career and skill development. As an academician, teacher, trainer, and NLP coach, Dr. Tewari has dedicated her career to empowering individuals—whether students, professionals, or corporate leaders. She has designed transformative workshops focused on self-awareness, communication, and professional growth. Her expertise in soft skills training, behavioural assessments, and coaching methodologies bridges the gap between academia and the corporate world. Beyond teaching, she has authored research papers, presented at international conferences, and pioneered initiatives that enhance employability and leadership skills. Her research paper, "Aspirations & Wants of Generation Z – A Study on the Workforce of the Future," presented at the International Conference on Technology & Business Management (CFD Dubai, 2017), won the Outstanding Paper Award. As the founder of stei, Dr. Tewari''s mission is simple: to equip individuals with the confidence, skills, and clarity they need to thrive in their careers and lives. With a holistic, results-driven approach, she continues to shape the future of personal and professional development.',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1573993472182%20%281%29.jpg-OVm1fWafCW2a4vffSUJCXikiuvnhme.jpeg',
  'sandhya@stei.com'
) ON CONFLICT (id) DO NOTHING;

-- Update existing workshops to have the default mentor
UPDATE workshops 
SET mentor_id = (SELECT id FROM mentors WHERE name = 'Dr. Sandhya Tewari' LIMIT 1)
WHERE mentor_id IS NULL;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'workshops_mentor_id_fkey'
    ) THEN
        ALTER TABLE workshops 
        ADD CONSTRAINT workshops_mentor_id_fkey 
        FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE SET NULL;
        
        RAISE NOTICE 'Added foreign key constraint for mentor_id';
    ELSE
        RAISE NOTICE 'Foreign key constraint already exists';
    END IF;
END $$; 