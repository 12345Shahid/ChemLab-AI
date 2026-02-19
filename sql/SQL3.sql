-- ═══════════════════════════════════════════════
-- SQL3: Fix / Update Existing Trigger
-- Run this ONLY IF you already ran SQL1 before this fix
-- This updates the trigger to include role and form from user metadata
-- ═══════════════════════════════════════════════

-- Update the trigger function to include role + form
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, full_name, role, form)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE((NEW.raw_user_meta_data->>'form')::integer, 1)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clean up: Delete any test users that were created during testing
-- (Uncomment and modify if needed)
-- DELETE FROM auth.users WHERE email = 'teststudent1@gmail.com';
-- DELETE FROM profiles WHERE email = 'teststudent1@gmail.com';
