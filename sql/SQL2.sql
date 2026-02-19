-- ═══════════════════════════════════════════════
-- SQL2: Quiz Results, Chat History, Topic Progress
-- Run this in Supabase SQL Editor (after SQL1)
-- ═══════════════════════════════════════════════

-- ─── Quiz Results ───
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  correct INTEGER NOT NULL,
  difficulty TEXT DEFAULT 'medium',
  questions JSONB DEFAULT '[]'::jsonb,
  answers JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own quiz results"
  ON quiz_results FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own quiz results"
  ON quiz_results FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can view all quiz results"
  ON quiz_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ─── Chat History ───
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id TEXT DEFAULT 'general',
  messages JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, topic_id)
);

ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own chat history"
  ON chat_history FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own chat history"
  ON chat_history FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own chat history"
  ON chat_history FOR UPDATE
  USING (auth.uid() = student_id);

-- ─── Topic Progress ───
CREATE TABLE IF NOT EXISTS topic_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  time_spent INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, topic_id)
);

ALTER TABLE topic_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own progress"
  ON topic_progress FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own progress"
  ON topic_progress FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own progress"
  ON topic_progress FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Admins can view all progress"
  ON topic_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view all chat history"
  ON chat_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ─── Indexes for Performance ───
CREATE INDEX IF NOT EXISTS idx_quiz_results_student ON quiz_results(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_topic ON quiz_results(topic_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_student ON chat_history(student_id);
CREATE INDEX IF NOT EXISTS idx_topic_progress_student ON topic_progress(student_id);
