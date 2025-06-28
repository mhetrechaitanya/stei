import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: "Missing database credentials",
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Create mentors table if it doesn't exist
    const createMentorsTableSQL = `
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
    `

    const { error: mentorsTableError } = await supabase.rpc("exec_sql", { sql: createMentorsTableSQL })

    if (mentorsTableError) {
      console.error("Error creating mentors table:", mentorsTableError)
      return NextResponse.json(
        {
          error: "Failed to create mentors table",
          details: mentorsTableError.message,
        },
        { status: 500 },
      )
    }

    // Add mentor_id column to workshops table if it doesn't exist
    const addMentorIdColumnSQL = `
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 
              FROM information_schema.columns 
              WHERE table_name = 'workshops' 
              AND column_name = 'mentor_id'
          ) THEN
              ALTER TABLE workshops ADD COLUMN mentor_id UUID;
              CREATE INDEX idx_workshops_mentor_id ON workshops(mentor_id);
          END IF;
      END $$;
    `

    const { error: mentorIdColumnError } = await supabase.rpc("exec_sql", { sql: addMentorIdColumnSQL })

    if (mentorIdColumnError) {
      console.error("Error adding mentor_id column:", mentorIdColumnError)
      return NextResponse.json(
        {
          error: "Failed to add mentor_id column",
          details: mentorIdColumnError.message,
        },
        { status: 500 },
      )
    }

    // Insert default mentor (Dr. Sandhya Tewari)
    const insertDefaultMentorSQL = `
      INSERT INTO mentors (name, title, bio, image, email) VALUES (
        'Dr. Sandhya Tewari',
        'PhD in Management, NLP Coach, Corporate Trainer',
        'Dr. Sandhya Tewari is a seasoned professional with over 30 years of experience in education, human resources, and personal development. A PhD holder in Management from PAHER University, Udaipur, and a Diploma recipient in Business Information from Alexander College, Perth, she brings a global perspective to career and skill development. As an academician, teacher, trainer, and NLP coach, Dr. Tewari has dedicated her career to empowering individuals—whether students, professionals, or corporate leaders. She has designed transformative workshops focused on self-awareness, communication, and professional growth. Her expertise in soft skills training, behavioural assessments, and coaching methodologies bridges the gap between academia and the corporate world. Beyond teaching, she has authored research papers, presented at international conferences, and pioneered initiatives that enhance employability and leadership skills. Her research paper, "Aspirations & Wants of Generation Z – A Study on the Workforce of the Future," presented at the International Conference on Technology & Business Management (CFD Dubai, 2017), won the Outstanding Paper Award. As the founder of stei, Dr. Tewari''s mission is simple: to equip individuals with the confidence, skills, and clarity they need to thrive in their careers and lives. With a holistic, results-driven approach, she continues to shape the future of personal and professional development.',
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1573993472182%20%281%29.jpg-OVm1fWafCW2a4vffSUJCXikiuvnhme.jpeg',
        'sandhya@stei.com'
      ) ON CONFLICT (id) DO NOTHING;
    `

    const { error: insertMentorError } = await supabase.rpc("exec_sql", { sql: insertDefaultMentorSQL })

    if (insertMentorError) {
      console.error("Error inserting default mentor:", insertMentorError)
      return NextResponse.json(
        {
          error: "Failed to insert default mentor",
          details: insertMentorError.message,
        },
        { status: 500 },
      )
    }

    // Update existing workshops to have the default mentor
    const updateWorkshopsSQL = `
      UPDATE workshops 
      SET mentor_id = (SELECT id FROM mentors WHERE name = 'Dr. Sandhya Tewari' LIMIT 1)
      WHERE mentor_id IS NULL;
    `

    const { error: updateWorkshopsError } = await supabase.rpc("exec_sql", { sql: updateWorkshopsSQL })

    if (updateWorkshopsError) {
      console.error("Error updating workshops:", updateWorkshopsError)
      return NextResponse.json(
        {
          error: "Failed to update workshops",
          details: updateWorkshopsError.message,
        },
        { status: 500 },
      )
    }

    // Add foreign key constraint if it doesn't exist
    const addForeignKeySQL = `
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
          END IF;
      END $$;
    `

    const { error: foreignKeyError } = await supabase.rpc("exec_sql", { sql: addForeignKeySQL })

    if (foreignKeyError) {
      console.error("Error adding foreign key constraint:", foreignKeyError)
      return NextResponse.json(
        {
          error: "Failed to add foreign key constraint",
          details: foreignKeyError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Mentors table and mentor_id column set up successfully",
      details: {
        mentorsTableCreated: true,
        mentorIdColumnAdded: true,
        defaultMentorInserted: true,
        workshopsUpdated: true,
        foreignKeyConstraintAdded: true,
      },
    })
  } catch (error) {
    console.error("Error setting up mentors:", error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
} 