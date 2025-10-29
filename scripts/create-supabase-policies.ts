import  { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { db } from "@/lib/storage/schema.drizzle"

// ============================================
// HELPER FUNCTIONS FOR SUPABASE SETUP
// ============================================

export async function enableRLS(db: ReturnType<typeof drizzle>) {
  console.log('Enabling Row Level Security...');
  
  await db.execute(sql`
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY
  `);
}

export async function createRLSPolicies(db: ReturnType<typeof drizzle>) {
  console.log('Creating RLS policies...');
  
  await db.execute(sql`
    CREATE POLICY "Public profiles are viewable by everyone." 
    ON profiles FOR SELECT 
    USING (TRUE)
  `);

  await db.execute(sql`
    CREATE POLICY "Users can insert their own profile." 
    ON profiles FOR INSERT 
    WITH CHECK ((SELECT auth.uid()) = id)
  `);

  await db.execute(sql`
    CREATE POLICY "Users can update own profile." 
    ON profiles FOR UPDATE 
    USING ((SELECT auth.uid()) = id)
  `);
}

export async function createAuthTriggers(db: ReturnType<typeof drizzle>) {
  console.log('Creating auth triggers...');
  
  // Create function for new users
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER SET search_path = ''
    AS $$
    BEGIN
      INSERT INTO public.profiles (id, username, first_name, last_name, full_name, email_verified, avatar_url)
      VALUES (
        new.id,
        new.raw_user_meta_data ->> 'user_name',
        new.raw_user_meta_data ->> 'first_name',
        new.raw_user_meta_data ->> 'last_name',
        new.raw_user_meta_data ->> 'full_name',
        (new.email_confirmed_at IS NOT NULL),
        new.raw_user_meta_data ->> 'avatar_url'
      );
      RETURN new;
    END;
    $$
  `);

  // Create trigger for new users
  await db.execute(sql`
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user()
  `);

  // Create function for updated users
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION public.handle_updated_user()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER SET search_path = ''
    AS $$
    BEGIN
      UPDATE public.profiles
      SET username = new.raw_user_meta_data ->> 'user_name',
          first_name = new.raw_user_meta_data ->> 'first_name',
          last_name = new.raw_user_meta_data ->> 'last_name',
          full_name = new.raw_user_meta_data ->> 'full_name',
          avatar_url = new.raw_user_meta_data ->> 'avatar_url',
          email_verified = (new.email_confirmed_at IS NOT NULL)
      WHERE id = new.id;
      RETURN new;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE NOTICE 'Error in handle_updated_user: %', SQLERRM;
        RAISE;
    END;
    $$
  `);

  // Create trigger for updated users
  await db.execute(sql`
    CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    WHEN (old.* IS DISTINCT FROM new.*)
    EXECUTE PROCEDURE public.handle_updated_user()
  `);
}

export async function setupStorage(db: ReturnType<typeof drizzle>) {
  console.log('Setting up storage...');
  
  // Create avatars bucket
  await db.execute(sql`
    INSERT INTO storage.buckets (id, name)
    VALUES ('avatars', 'avatars')
  `);

  // Create storage policies
  await db.execute(sql`
    CREATE POLICY "Avatar images are publicly accessible." 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'avatars')
  `);

  await db.execute(sql`
    CREATE POLICY "Anyone can upload an avatar." 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'avatars')
  `);
}

// ============================================
// MAIN SETUP FUNCTION
// ============================================

export async function setupSupabaseSchema(db: ReturnType<typeof drizzle>) {
  try {
    console.log('Starting Supabase schema setup...');
    
    await enableRLS(db);
    await createRLSPolicies(db);
    await createAuthTriggers(db);
    await setupStorage(db);
    
    console.log('✅ Schema setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up schema:', error);
    throw error;
  }
}

// Wrap in IIFE
(async () => {
  try {
    await setupSupabaseSchema(db);
    console.log("Supabase schema setup complete");
    process.exit(0);
  } catch (err) {
    console.error("Schema setup failed:", err);
    process.exit(1);
  }
})();