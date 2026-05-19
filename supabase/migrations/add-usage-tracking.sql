-- Migration to add daily usage tracking columns to the users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS daily_usage_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_usage_reset TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
