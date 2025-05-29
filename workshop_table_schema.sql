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
