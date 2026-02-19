-- Migrate existing users to Form 1 by default if they don't have a form set
UPDATE profiles SET form = 1 WHERE form IS NULL;

-- Set a default value for the form column for future signups (just in case)
ALTER TABLE profiles ALTER COLUMN form SET DEFAULT 1;

-- Add comment for clarity
COMMENT ON COLUMN profiles.form IS 'HK Form level (1, 2, or 3) for the student/teacher.';
