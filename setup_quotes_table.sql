-- Create quotes table if it doesn't exist
CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert some initial quotes
INSERT INTO quotes (text, author, category) VALUES
('The only way to do great work is to love what you do.', 'Steve Jobs', 'motivation'),
('Success is not final, failure is not fatal: It is the courage to continue that counts.', 'Winston Churchill', 'success'),
('Education is the most powerful weapon which you can use to change the world.', 'Nelson Mandela', 'education'),
('The future belongs to those who believe in the beauty of their dreams.', 'Eleanor Roosevelt', 'dreams'),
('Leadership is not about being in charge. It is about taking care of those in your charge.', 'Simon Sinek', 'leadership'),
('The greatest glory in living lies not in never falling, but in rising every time we fall.', 'Nelson Mandela', 'resilience'),
('Life is what happens when you're busy making other plans.', 'John Lennon', 'life'),
('The way to get started is to quit talking and begin doing.', 'Walt Disney', 'action'),
('Your time is limited, so don't waste it living someone else's life.', 'Steve Jobs', 'inspiration')
ON CONFLICT (id) DO NOTHING;
