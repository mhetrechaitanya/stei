import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  console.log("Workshop creation API called");

  try {
    // Parse request body
    let workshopData;
    try {
      workshopData = await request.json();
      console.log(
        "Request body parsed successfully:",
        JSON.stringify(workshopData)
      );
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: "Could not parse JSON",
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!workshopData.title) {
      console.error("Missing required field: title");
      return NextResponse.json(
        {
          error: "Missing required field",
          details: "Title is required",
        },
        { status: 400 }
      );
    }

    if (!workshopData.description) {
      console.error("Missing required field: description");
      return NextResponse.json(
        {
          error: "Missing required field",
          details: "Description is required",
        },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    if (!workshopData.slug) {
      workshopData.slug = workshopData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      console.log("Generated slug:", workshopData.slug);
    }

    // Ensure benefits is an array
    if (!workshopData.benefits || !Array.isArray(workshopData.benefits)) {
      workshopData.benefits = ["Learn valuable skills"];
      console.log("Set default benefits:", workshopData.benefits);
    }

    // Initialize Supabase client
    console.log("Initializing Supabase client");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials:", {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
      });
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: "Missing database credentials",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if tables exist
    const { error: tableCheckError } = await supabase
      .from("workshops")
      .select("count(*)")
      .limit(1);

    // If table doesn't exist, try to create it
    if (tableCheckError && tableCheckError.code === "42P01") {
      console.log("Workshops table doesn't exist, creating it");

      // Try to create the table
      await createWorkshopTables(supabase);
    }

    // Generate a unique workshop code
    const workshopCode = generateWorkshopCode(workshopData.title);
    console.log("Generated workshop code:", workshopCode);

    // Prepare workshop data
    console.log("Preparing workshop data for insertion");
    const workshopRecord = {
      title: workshopData.title,
      slug: workshopData.slug,
      description: workshopData.description,
      image: workshopData.image || "/placeholder.svg?height=400&width=600", // Default placeholder
      sessions: Number(workshopData.sessions) || 4,
      duration: workshopData.duration || "2 hours per session",
      capacity: Number(workshopData.capacity) || 15,
      price: Number(workshopData.price) || 4999,
      featured: Boolean(workshopData.featured),
      status: workshopData.status || "active",
      benefits: workshopData.benefits,
      workshop_code: workshopCode,
      zoom_link: workshopData.zoomLink || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("Workshop record prepared:", JSON.stringify(workshopRecord));

    // Insert workshop
    console.log("Inserting workshop into database");
    const { data, error } = await supabase
      .from("workshops")
      .insert(workshopRecord)
      .select();

    if (error) {
      console.error("Database error when inserting workshop:", error);

      // Check if it's a duplicate slug error
      if (error.code === "23505" && error.message.includes("slug")) {
        return NextResponse.json(
          {
            error: "Duplicate slug",
            details: "A workshop with this slug already exists",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error: "Database error",
          details: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.error("No data returned from insert operation");
      return NextResponse.json(
        {
          error: "Database error",
          details: "No data returned from insert operation",
        },
        { status: 500 }
      );
    }

    const workshopId = data[0].id;
    console.log("Workshop created successfully with ID:", workshopId);

    // Check if batch table exists
    const { error: batchTableCheckError } = await supabase
      .from("workshop_batches")
      .select("count(*)")
      .limit(1);

    // If batch table doesn't exist, we'll skip batch creation
    if (batchTableCheckError && batchTableCheckError.code === "42P01") {
      console.log(
        "Workshop_batches table doesn't exist, skipping batch creation"
      );

      // Revalidate the workshops page
      revalidatePath("/workshops");

      return NextResponse.json({
        success: true,
        id: workshopId,
        data: {
          workshop_code: workshopCode,
        },
        message: "Workshop created successfully (batch creation skipped)",
      });
    }

    // Create a batch if startDate is provided
    if (workshopData.startDate) {
      console.log("Creating batch for workshop");
      const batchRecord = {
        workshop_id: workshopId,
        date: workshopData.startDate,
        time:
          workshopData.startTime && workshopData.endTime
            ? `${workshopData.startTime} - ${workshopData.endTime}`
            : workshopData.startTime
            ? `${workshopData.startTime} - TBD`
            : "10:00 - 12:00",
        slots: Number(workshopData.capacity) || 15,
        enrolled: 0,
      };

      console.log("Batch record prepared:", JSON.stringify(batchRecord));

      const { error: batchError } = await supabase
        .from("workshop_batches")
        .insert(batchRecord);

      if (batchError) {
        console.error("Error creating batch:", batchError);
        // Don't fail the operation if batch creation fails
      } else {
        console.log("Batch created successfully");
      }
    }

    // Revalidate the workshops page
    revalidatePath("/workshops");

    // Return success response
    return NextResponse.json({
      success: true,
      id: workshopId,
      data: {
        workshop_code: workshopCode,
      },
      message: "Workshop created successfully",
    });
  } catch (error) {
    console.error("Unexpected error in workshop creation:", error);
    return NextResponse.json(
      {
        error: "Server error",
        details: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

// GET handler to fetch all workshops
export async function GET(request: Request) {
  // Add cache headers to prevent caching
  const headers = new Headers({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  });

  console.log("GET workshops API called");

  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials in GET workshops");
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: "Missing database credentials",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if table exists first
    console.log("Checking if workshops table exists");
    const { error: tableCheckError } = await supabase
      .from("workshops")
      .select("id")
      .limit(1);

    if (tableCheckError && tableCheckError.code === "42P01") {
      console.log("Workshops table doesn't exist, creating it");
      const created = await createWorkshopTables(supabase);

      if (created) {
        // Create some sample workshops if none exist
        await createSampleWorkshops(supabase);
        console.log("Sample workshops created");

        // Return sample workshops
        const { data: sampleData } = await supabase
          .from("workshops")
          .select("*");
        return NextResponse.json(sampleData || [], { headers });
      } else {
        return NextResponse.json(
          {
            error: "Failed to create workshops table",
            details: "Could not initialize the database",
          },
          { status: 500 }
        );
      }
    }

    console.log("Fetching all workshops");
    const { data, error } = await supabase
      .from("workshops")
      .select("*, batches:workshop_batches(*)")
      .order("created_at", { ascending: false });

    console.log("in workshop route : ", data);

    if (error) {
      console.error("Error fetching workshops:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch workshops",
          details: error.message,
        },
        { status: 500, headers }
      );
    }

    // If no workshops found or initialization is requested, create sample ones
    const isInitializing = request.headers.get("x-initialize") === "true";
    if (isInitializing || !data || data.length === 0) {
      console.log(
        "No workshops found or initialization requested, creating samples"
      );
      await createSampleWorkshops(supabase);

      // Fetch again after creating samples
      const { data: sampleData, error: sampleError } = await supabase
        .from("workshops")
        .select("*, batches:workshop_batches(*)")
        .order("created_at", { ascending: false });

      if (sampleError) {
        console.error("Error fetching sample workshops:", sampleError);
        return NextResponse.json([], { headers });
      }

      // Transform the sample data to include compatibility field names
      const transformedSampleData = sampleData?.map(workshop => ({
        ...workshop,
        title: workshop.name,
        price: workshop.fee,
        sessions: workshop.sessions_r,
        duration: workshop.duration_v && workshop.duration_u ? `${workshop.duration_v} ${workshop.duration_u}` : "2 hours per session",
      })) || [];

      console.log(
        `Successfully created and fetched ${
          transformedSampleData?.length || 0
        } sample workshops`
      );
      return NextResponse.json(transformedSampleData, { headers });
    }

    // Transform the data to include compatibility field names
    const transformedData = data?.map(workshop => ({
      ...workshop,
      title: workshop.name,
      price: workshop.fee,
      sessions: workshop.sessions_r,
      duration: workshop.duration_v && workshop.duration_u ? `${workshop.duration_v} ${workshop.duration_u}` : "2 hours per session",
    })) || [];

    console.log(`Successfully fetched ${transformedData?.length || 0} workshops`);
    console.log(transformedData)
    return NextResponse.json(transformedData, { headers });
  } catch (error) {
    console.error("Unexpected error in GET workshops:", error);
    return NextResponse.json(
      {
        error: "Server error",
        details: error.message || "An unexpected error occurred",
      },
      { status: 500, headers }
    );
  }
}

// Helper function to create workshop tables
async function createWorkshopTables(supabase) {
  console.log("Creating workshop tables");

  try {
    // Try to create the exec_sql function if it doesn't exist
    try {
      const functionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql_string text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $
      BEGIN
        EXECUTE sql_string;
      END;
      $;
    `;

      // Try to execute the function creation directly
      await supabase
        .rpc("exec_sql", { sql_string: functionSQL })
        .catch((e) =>
          console.log(
            "Function may already exist or couldn't be created:",
            e.message
          )
        );
    } catch (e) {
      console.log("Error creating function:", e.message);
    }

    // Create workshops table
    try {
      const workshopsSQL = `
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
        workshop_code TEXT,
        zoom_link TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      ALTER TABLE workshops DISABLE ROW LEVEL SECURITY;
    `;

      await supabase
        .rpc("exec_sql", { sql_string: workshopsSQL })
        .catch((e) => console.error("Error creating workshops table:", e));
    } catch (e) {
      console.error("Error creating workshops table:", e);
    }

    // Create workshop_batches table
    try {
      const batchesSQL = `
      CREATE TABLE IF NOT EXISTS workshop_batches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        workshop_id UUID NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        slots INTEGER DEFAULT 15,
        enrolled INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      ALTER TABLE workshop_batches DISABLE ROW LEVEL SECURITY;
    `;

      await supabase
        .rpc("exec_sql", { sql_string: batchesSQL })
        .catch((e) =>
          console.error("Error creating workshop_batches table:", e)
        );
    } catch (e) {
      console.error("Error creating workshop_batches table:", e);
    }

    return true;
  } catch (error) {
    console.error("Error creating tables:", error);
    return false;
  }
}

// Helper function to generate a workshop code
function generateWorkshopCode(title: string): string {
  const prefix = title
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .substring(0, 3);

  const randomPart = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}${randomPart}`;
}

// Helper function to create sample workshops
async function createSampleWorkshops(supabase) {
  const sampleWorkshops = [
    {
      title: "Leadership Development",
      slug: "leadership-development",
      description:
        "Develop essential leadership skills to inspire and guide your team to success.",
      image: "/leadership-workshop.png",
      sessions: 6,
      duration: "2 hours per session",
      capacity: 15,
      price: 5999,
      featured: true,
      status: "active",
      benefits: [
        "Improve team communication",
        "Learn effective delegation",
        "Develop strategic thinking",
      ],
      workshop_code: "LED1234",
      category: "Self-growth",
    },
    {
      title: "Public Speaking Mastery",
      slug: "public-speaking-mastery",
      description:
        "Overcome fear and master the art of public speaking with confidence and clarity.",
      image: "/placeholder.svg?key=kupip",
      sessions: 4,
      duration: "3 hours per session",
      capacity: 12,
      price: 4999,
      featured: true,
      status: "active",
      benefits: [
        "Overcome stage fright",
        "Structure compelling presentations",
        "Engage any audience",
      ],
      workshop_code: "PSM5678",
      category: "iACE Series",
    },
    {
      title: "Career Advancement Strategies",
      slug: "career-advancement-strategies",
      description:
        "Learn proven strategies to advance your career and achieve your professional goals.",
      image: "/placeholder.svg?key=jsvm9",
      sessions: 5,
      duration: "2 hours per session",
      capacity: 20,
      price: 3999,
      featured: false,
      status: "active",
      benefits: [
        "Create effective career plans",
        "Build professional networks",
        "Develop personal branding",
      ],
      workshop_code: "CAS9012",
      category: "Self-growth",
    },
    {
      title: "Women's Leadership Summit",
      slug: "womens-leadership-summit",
      description:
        "Empower yourself with leadership skills specifically designed for women in the workplace.",
      image: "/placeholder.svg?key=hn9hm",
      sessions: 3,
      duration: "4 hours per session",
      capacity: 15,
      price: 6999,
      featured: true,
      status: "active",
      benefits: [
        "Navigate workplace challenges",
        "Build confidence",
        "Create support networks",
      ],
      workshop_code: "WLS3456",
      category: "The Strength of She",
    },
  ];

  // First check if the category column exists
  try {
    // Try to add the category column if it doesn't exist
    const addCategoryColumnSQL = `
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'workshops' 
          AND column_name = 'category'
        ) THEN
          ALTER TABLE workshops ADD COLUMN category TEXT;
        END IF;
      END
      $$;
    `;

    await supabase
      .rpc("exec_sql", { sql_string: addCategoryColumnSQL })
      .catch((e) =>
        console.log(
          "Error adding category column or column already exists:",
          e.message
        )
      );
  } catch (e) {
    console.log("Error checking/adding category column:", e.message);
  }

  for (const workshop of sampleWorkshops) {
    // Check if workshop with this slug already exists
    const { data: existingWorkshop } = await supabase
      .from("workshops")
      .select("id")
      .eq("slug", workshop.slug)
      .single();

    if (existingWorkshop) {
      console.log(`Workshop ${workshop.slug} already exists, updating it`);

      // Update the existing workshop
      await supabase
        .from("workshops")
        .update({
          ...workshop,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingWorkshop.id);
    } else {
      console.log(`Creating new workshop: ${workshop.slug}`);

      // Insert new workshop
      await supabase.from("workshops").insert({
        ...workshop,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // Get the workshop ID (either existing or newly created)
    const { data } = await supabase
      .from("workshops")
      .select("id")
      .eq("slug", workshop.slug)
      .single();

    if (data) {
      // Check if a batch already exists for this workshop
      const { data: existingBatches } = await supabase
        .from("workshop_batches")
        .select("id")
        .eq("workshop_id", data.id)
        .limit(1);

      if (!existingBatches || existingBatches.length === 0) {
        console.log(`Creating batch for workshop: ${workshop.slug}`);

        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 14); // Two weeks from now

        await supabase.from("workshop_batches").insert({
          workshop_id: data.id,
          date: startDate.toISOString().split("T")[0],
          time: "10:00 - 12:00",
          slots: workshop.capacity,
          enrolled: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }
  }
}
