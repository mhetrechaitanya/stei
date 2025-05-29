-- Function to create workshops table
CREATE OR REPLACE FUNCTION create_workshops_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create workshops table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.workshops (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$;

-- Function to create workshop_batches table
CREATE OR REPLACE FUNCTION create_workshop_batches_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create workshop_batches table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.workshop_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workshop_id UUID NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    slots INTEGER DEFAULT 15,
    enrolled INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_workshop
      FOREIGN KEY(workshop_id)
      REFERENCES public.workshops(id)
      ON DELETE CASCADE
  );
END;
$$;

-- Function to disable RLS for workshops tables
CREATE OR REPLACE FUNCTION disable_rls_for_workshops()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Disable RLS for workshops table
  ALTER TABLE public.workshops DISABLE ROW LEVEL SECURITY;
  
  -- Disable RLS for workshop_batches table
  ALTER TABLE public.workshop_batches DISABLE ROW LEVEL SECURITY;
  
  -- Drop any existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Allow public read access" ON public.workshops;
  DROP POLICY IF EXISTS "Allow authenticated insert access" ON public.workshops;
  DROP POLICY IF EXISTS "Allow authenticated update access" ON public.workshops;
  DROP POLICY IF EXISTS "Allow authenticated delete access" ON public.workshops;

  DROP POLICY IF EXISTS "Allow public read access" ON public.workshop_batches;
  DROP POLICY IF EXISTS "Allow authenticated insert access" ON public.workshop_batches;
  DROP POLICY IF EXISTS "Allow authenticated update access" ON public.workshop_batches;
  DROP POLICY IF EXISTS "Allow authenticated delete access" ON public.workshop_batches;
END;
$$;
