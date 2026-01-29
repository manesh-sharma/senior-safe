# Supabase Setup Guide for SeniorSafe

This guide explains how to set up Supabase to store user data, wallet balances, and transaction history.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Project Name**: `seniorsafe`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
4. Wait for the project to be created (~2 minutes)

## 2. Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of [`schema.sql`](./schema.sql) and paste it
4. Click "Run" to create all tables

This creates:
- `users` - Stores user profiles (synced from Google OAuth)
- `wallets` - Stores user balance (default ₹10,000)
- `transactions` - Stores all transaction history
- `contacts` - Stores user's saved contacts

## 3. Get Your API Keys

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

## 4. Configure Environment Variables

Add these to your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 5. Test the Integration

1. Start the app: `npm run dev`
2. Login with Google
3. Make a transaction
4. Check your Supabase dashboard:
   - **Table Editor** → `users` (should see your account)
   - **Table Editor** → `wallets` (should see balance)
   - **Table Editor** → `transactions` (should see history)

## Database Schema

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │       │   wallets    │       │ transactions │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (UUID)    │◄──────│ user_id      │       │ id (UUID)    │
│ google_id    │       │ balance      │       │ user_id      │──►
│ email        │       │ created_at   │       │ amount       │
│ name         │       │ updated_at   │       │ type         │
│ picture      │       └──────────────┘       │ description  │
│ created_at   │                              │ to_name      │
│ updated_at   │       ┌──────────────┐       │ created_at   │
└──────────────┘       │   contacts   │       └──────────────┘
                       ├──────────────┤
                       │ id (UUID)    │
                       │ user_id      │──►
                       │ name         │
                       │ phone        │
                       │ created_at   │
                       └──────────────┘
```

## How It Works

### Data Flow

1. **User Login** (Google OAuth)
   - App decodes Google JWT token
   - Creates/updates user in Supabase `users` table
   - Creates wallet with ₹10,000 if new user

2. **Transaction**
   - Updates local state immediately (optimistic UI)
   - Syncs to Supabase in background
   - Updates wallet balance

3. **Offline Mode**
   - If Supabase is not configured, app uses localStorage
   - Data persists locally on device
   - No cross-device sync in offline mode

### Security

- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- API key is safe to expose (it's the "anon" key)
- All sensitive operations go through Supabase policies

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists with correct values
- Restart dev server after adding env vars

### Data not syncing
- Check browser console for errors
- Verify Supabase URL and key are correct
- Check Supabase dashboard logs

### Tables not created
- Run the full `schema.sql` in SQL Editor
- Check for any SQL errors in output

## Admin Dashboard (Optional)

To view platform statistics, you can query the `user_stats` view:

```sql
SELECT * FROM user_stats;
```

This returns:
- `total_users` - Number of registered users
- `total_balance` - Sum of all wallet balances
- `total_transactions` - Total number of transactions
