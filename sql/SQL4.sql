-- ═══════════════════════════════════════════════
-- SQL4: Fix RLS Infinite Recursion on Profiles
-- Run this in Supabase SQL Editor NOW
-- ═══════════════════════════════════════════════

-- Problem: The "Admins can view all profiles" policy queries the
-- profiles table itself, causing infinite recursion (error 42P17).

-- Fix: Drop the recursive policy and replace it with one that
-- checks the user's role from auth.jwt() metadata instead.

-- Step 1: Drop the broken policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Step 2: Create a non-recursive admin policy using JWT metadata
-- This reads the role from the user's JWT token (set during signup)
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id   -- users can always see their own profile
    OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Step 3: Also allow admins to view quiz_results, chat_history, topic_progress
-- (These may also have the same recursion issue if they reference profiles)

DROP POLICY IF EXISTS "Admins can view all results" ON quiz_results;
CREATE POLICY "Admins can view all results"
  ON quiz_results FOR SELECT
  USING (
    student_id = auth.uid()
    OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

DROP POLICY IF EXISTS "Admins can view all progress" ON topic_progress;
CREATE POLICY "Admins can view all progress"
  ON topic_progress FOR SELECT
  USING (
    student_id = auth.uid()
    OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

DROP POLICY IF EXISTS "Admins can view all chat" ON chat_history;
CREATE POLICY "Admins can view all chat"
  ON chat_history FOR SELECT
  USING (
    student_id = auth.uid()
    OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
