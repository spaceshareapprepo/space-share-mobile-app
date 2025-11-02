
import { db } from "@/lib/storage/db";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

// ============================================
// HELPER FUNCTIONS FOR SUPABASE RESET
// ============================================

export async function dropExistingSchema(db: ReturnType<typeof drizzle>) {
  console.log('Dropping existing schema...');
  
  await db.execute(sql`
    -- Drop storage objects and buckets
    DELETE FROM storage.objects WHERE bucket_id = 'avatars';
    DELETE FROM storage.buckets WHERE id = 'avatars';
  `);

  await db.execute(sql`
    -- Drop existing policies
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
    DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
    DROP POLICY IF EXISTS "Anyone can upload an avatar." ON storage.objects;
  `);

  await db.execute(sql`
    -- Drop triggers and functions
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
    DROP FUNCTION IF EXISTS public.handle_new_user;
    DROP FUNCTION IF EXISTS public.handle_updated_user;
  `);

  await db.execute(sql`
    DROP TABLE IF EXISTS public.messages CASCADE;
    DROP TABLE IF EXISTS public.threads CASCADE;
    DROP TABLE IF EXISTS public.listings CASCADE;
    DROP TABLE IF EXISTS public.profiles CASCADE;
    DROP TABLE IF EXISTS public.airports CASCADE;
  `);
}

export async function cleanUpSupabaseSchema(db: ReturnType<typeof drizzle>) {
  try {
    console.log('Starting Supabase schema cleanup...');
    
    await dropExistingSchema(db);
    
    console.log('✅ Schema cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Error cleaning up schema:', error);
    throw error;
  }
}

// Wrap in IIFE
(async () => {
  try {
    await cleanUpSupabaseSchema(db);
    console.log('Supabase schema cleanup complete');
    process.exit(0);
  } catch (err) {
    console.error('Schema cleanup failed:', err);
    process.exit(1);
  }
})();