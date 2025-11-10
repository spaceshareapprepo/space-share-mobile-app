import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
config({ path: '.env.local' });

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/storage/schema.drizzle.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: false
  },
});

// src\lib\storage\schema.drizzle.ts