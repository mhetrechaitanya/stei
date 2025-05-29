-- Create workshops table
CREATE TABLE IF NOT EXISTS workshops (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image VARCHAR(255),
    sessions INTEGER DEFAULT 1,
    duration VARCHAR(100),
    capacity INTEGER DEFAULT 10,
    price INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'active',
    benefits TEXT[] DEFAULT ARRAY['Learn valuable skills'],
    workshop_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create workshop batches table
CREATE TABLE IF NOT EXISTS workshop_batches (
    id SERIAL PRIMARY KEY,
    workshop_id INTEGER REFERENCES workshops(id) ON DELETE CASCADE,
    date VARCHAR(100),
    time VARCHAR(100),
    slots INTEGER DEFAULT 10,
    enrolled INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    workshop_id INTEGER REFERENCES workshops(id) ON DELETE SET NULL,
    batch_id INTEGER REFERENCES workshop_batches(id) ON DELETE SET NULL,
    registered_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(50) DEFAULT 'pending',
    amount INTEGER DEFAULT 0,
    transaction_id VARCHAR(100),
    affiliate VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on workshop_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_workshop_id ON students(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_batches_workshop_id ON workshop_batches(workshop_id);
