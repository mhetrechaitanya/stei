-- Mentors Table Schema
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

-- Workshops Table Schema
CREATE TABLE IF NOT EXISTS workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  image TEXT,
  sessions INTEGER DEFAULT 4,
  duration TEXT DEFAULT '2 hours per session',
  capacity INTEGER DEFAULT 15,
  price INTEGER DEFAULT 4999,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active',
  benefits TEXT[] DEFAULT ARRAY['Learn valuable skills'],
  workshop_code TEXT UNIQUE,
  zoom_link TEXT,
  mentor_id UUID REFERENCES mentors(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workshop Batches Table Schema
CREATE TABLE IF NOT EXISTS workshop_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  slots INTEGER DEFAULT 15,
  enrolled INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workshop Affiliates Table Schema
CREATE TABLE IF NOT EXISTS workshop_affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  commission INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workshop_id, code)
);

-- Insert default mentor (Dr. Sandhya Tewari)
INSERT INTO mentors (name, title, bio, image, email) VALUES (
  'Dr. Sandhya Tewari',
  'PhD in Management, NLP Coach, Corporate Trainer',
  'Dr. Sandhya Tewari is a seasoned professional with over 30 years of experience in education, human resources, and personal development. A PhD holder in Management from PAHER University, Udaipur, and a Diploma recipient in Business Information from Alexander College, Perth, she brings a global perspective to career and skill development. As an academician, teacher, trainer, and NLP coach, Dr. Tewari has dedicated her career to empowering individuals—whether students, professionals, or corporate leaders. She has designed transformative workshops focused on self-awareness, communication, and professional growth. Her expertise in soft skills training, behavioural assessments, and coaching methodologies bridges the gap between academia and the corporate world. Beyond teaching, she has authored research papers, presented at international conferences, and pioneered initiatives that enhance employability and leadership skills. Her research paper, "Aspirations & Wants of Generation Z – A Study on the Workforce of the Future," presented at the International Conference on Technology & Business Management (CFD Dubai, 2017), won the Outstanding Paper Award. As the founder of stei, Dr. Tewari''s mission is simple: to equip individuals with the confidence, skills, and clarity they need to thrive in their careers and lives. With a holistic, results-driven approach, she continues to shape the future of personal and professional development.',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1573993472182%20%281%29.jpg-OVm1fWafCW2a4vffSUJCXikiuvnhme.jpeg',
  'sandhya@stei.com'
) ON CONFLICT (id) DO NOTHING;
