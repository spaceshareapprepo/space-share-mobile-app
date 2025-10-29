import { resetSupabase } from '@/lib/storage/schema.drizzle';

resetSupabase()
  .then(() => {
    console.log('Supabase schema setup complete');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Schema setup failed:', err);
    process.exit(1);
  });
