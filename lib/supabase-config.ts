// This file contains configuration constants for Supabase tables and other settings

export const TABLES = {
  // Workshop related tables
  WORKSHOPS: "workshops",
  WORKSHOP_BATCHES: "workshop_batches",

  // Student related tables
  STUDENTS: "students",
  ENROLLMENTS: "enrollments",

  // Content related tables
  TESTIMONIALS: "testimonials",
  SETTINGS: "site_settings",
  QUOTES: "Inspiration_quotes", // Updated to match the exact case in the database

  // Admin related tables
  ADMINS: "admin_users",
  ACTIVITY_LOG: "activity_log",

  // Email related tables
  EMAIL_TEMPLATES: "email_templates",
  EMAIL_LOGS: "email_logs",
}

export const STORAGE_BUCKETS = {
  WORKSHOP_IMAGES: "workshop-images",
  STUDENT_DOCUMENTS: "student-documents",
  TESTIMONIAL_IMAGES: "testimonial-images",
  SITE_ASSETS: "site-assets",
}

export const DEFAULT_PAGE_SIZE = 20

export const WORKSHOP_STATUSES = {
  ACTIVE: "active",
  DRAFT: "draft",
  ARCHIVED: "archived",
  UPCOMING: "upcoming",
  COMPLETED: "completed",
}

export const PAYMENT_STATUSES = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
}
