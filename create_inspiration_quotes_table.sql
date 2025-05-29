-- Function to create the inspiration_quotes table if it doesn't exist
CREATE OR REPLACE FUNCTION create_inspiration_quotes_table()
RETURNS void AS $$
BEGIN
  -- Check if the table already exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'inspiration_quotes'
  ) THEN
    -- Create the table
    CREATE TABLE public.inspiration_quotes (
      id SERIAL PRIMARY KEY,
      quote TEXT NOT NULL,
      author VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      color VARCHAR(50),
      is_featured BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Add some initial quotes
    INSERT INTO public.inspiration_quotes (quote, author, category, is_featured) VALUES
    ('The only way to do great work is to love what you do.', 'Steve Jobs', 'Motivation', true),
    ('Believe you can and you're halfway there.', 'Theodore Roosevelt', 'Inspiration', true),
    ('It does not matter how slowly you go as long as you do not stop.', 'Confucius', 'Perseverance', false),
    ('Success is not final, failure is not fatal: It is the courage to continue that counts.', 'Winston Churchill', 'Success', false),
    ('The future belongs to those who believe in the beauty of their dreams.', 'Eleanor Roosevelt', 'Dreams', false),
    ('The best way to predict the future is to create it.', 'Peter Drucker', 'Future', false);
    
    RAISE NOTICE 'inspiration_quotes table created successfully';
  ELSE
    RAISE NOTICE 'inspiration_quotes table already exists';
  END IF;
END;
$$ LANGUAGE plpgsql;
