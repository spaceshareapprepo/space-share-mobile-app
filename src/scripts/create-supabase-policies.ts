import { db } from "@/src/lib/storage/db";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

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

export async function createFunctionsAndTriggers(db: ReturnType<typeof drizzle>) {
  console.log('Creating auth triggers...');
  
  // Create function for new users
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER SET search_path = ''
    AS $$
    BEGIN
      INSERT INTO public.profiles (id, username, first_name, last_name, full_name, email, email_verified, avatar_url)
      VALUES (
        new.id,
        new.raw_user_meta_data ->> 'user_name',
        new.raw_user_meta_data ->> 'first_name',
        new.raw_user_meta_data ->> 'last_name',
        new.raw_user_meta_data ->> 'full_name',
        new.raw_user_meta_data ->> 'email',
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
          email = new.raw_user_meta_data ->> 'email',
          email_verified = (new.email_confirmed_at IS NOT NULL),
          avatar_url = new.raw_user_meta_data ->> 'avatar_url'
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

  // Create index for searching by label
  await db.execute(sql`
    CREATE INDEX idx_airports_label ON public.airports(label)
  `);

  //Function to copy airport names
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION copy_airport_names()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Get origin airport name
      SELECT name INTO NEW.origin_name
      FROM airports
      WHERE id = NEW.origin_id;
      
      -- Get destination airport name
      SELECT name INTO NEW.destination_name
      FROM airports
      WHERE id = NEW.destination_id;
      
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Trigger on INSERT
  await db.execute(sql`
    CREATE TRIGGER set_airport_names_on_insert
    BEFORE INSERT ON listings
    FOR EACH ROW
    EXECUTE FUNCTION copy_airport_names();
  `);

  // Trigger on UPDATE (in case origin/destination changes)
  await db.execute(sql`
    CREATE TRIGGER set_airport_names_on_update
    BEFORE UPDATE OF origin_id, destination_id ON listings
    FOR EACH ROW
    WHEN (OLD.origin_id IS DISTINCT FROM NEW.origin_id OR OLD.destination_id IS DISTINCT FROM NEW.destination_id)
    EXECUTE FUNCTION copy_airport_names();
  `);
}

export async function createPolicies(db: ReturnType<typeof drizzle>) {
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
    await createFunctionsAndTriggers(db);
    await createPolicies(db);
    
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