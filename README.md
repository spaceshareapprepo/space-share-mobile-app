# SpaceShare Mobile

SpaceShare is a cross-platform Expo app that connects travellers with shippers along the USA to Ghana corridor. Search for travellers or shipment requests, publish your own space, track posts in My Spaces, and coordinate hand-offs from the inbox.

## Features
- Traveller and shipment search with quick filters and route or item focus
- Publish flow for offering travel space or posting shipment requests with pricing and weight details
- My Spaces dashboard to track shipped items and offered space listings
- Inbox and profile screens to manage conversations and verification signals
- Supabase-backed auth, data, and storage with Expo Router UI

## Tech stack
- React Native 0.81 with Expo, Expo Router, NativeWind, and Gluestack UI
- Supabase client for auth and data; Drizzle ORM for database schema and migrations
- Expo server adapter for API routes (Vercel)

## Getting started
1) Install dependencies
```bash
npm install
```
2) Configure environment (create `.env.local`)
```bash
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_KEY=your-supabase-anon-key
EXPO_PUBLIC_API_URL=https://your-api.example.com      # optional for hosted search/API calls
EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID=your-web-client # optional: Google sign-in on web
DATABASE_URL=postgres://...                           # required for Drizzle CLI and DB scripts
```
3) Start the app
```bash
npm start            # launches Expo CLI (use Expo Go, simulator, or emulator)
```
4) Platform targets
- `npm run android` to build/run on Android
- `npm run ios` to build/run on iOS (macOS with Xcode)
- `npm run web` to run the web build
5) Database and Supabase helpers (optional)
- `npm run reset-supabase` to reset, push Drizzle migrations, and apply policies
- `npm run db:seed` to seed sample data
- `npm run lint` to check code quality

## Daily Log

### 2025-11-26
- Stabilized inbox: threads now load once per user session, filter for buyer/seller, render avatars safely, and fixed hook ordering that caused render errors.
- Hardened message fetching: `useMessageQuery` now returns typed `{ data, error }` with optional filters and ordering, and `useThreadsQuery` filters correctly by user.

### 2025-11-25
- Rewrote README with project overview, quickstart steps, and environment notes.
- Fixed chat flows: converted inbox page to sync component with guarded auth, ensured threads use correct IDs, pulled messages by `thread_id`, and stabilized chat layout/input scrolling.

### 2025-11-16
* Added Supabase Types using cmd
```
 npx supabase gen types typescript --project-id ******jkjsyswo****** > ./src/lib/database/supabase.types.ts 
 ```

### 2025-11-15
