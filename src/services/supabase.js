// ═══════════════════════════════════════════════
// Supabase Client — Auth & Data Helpers
// ═══════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not set. Auth and data persistence disabled.');
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ─── Auth Helpers ───

export async function signUp({ email, password, username, fullName, role = 'student', form = 1 }) {
  if (!supabase) return { error: { message: 'Supabase not configured' } };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: fullName,
        role,
        form
      }
    }
  });

  if (error) return { data: null, error };
  return { data, error: null };
}

export async function signIn({ email, password }) {
  if (!supabase) return { error: { message: 'Supabase not configured' } };
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  if (!supabase) return;
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(userId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Profile fetch error:', error);
    // Return a minimal profile to avoid breaking the UI/Auth flow
    return { id: userId, username: 'User', role: 'student', form: 1 };
  }
  return data;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  return await getProfile(user.id);
}

export function onAuthStateChange(callback) {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
  return supabase.auth.onAuthStateChange(callback);
}

// ─── Data Helpers ───

export async function saveQuizResultDB(studentId, topicId, result) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('quiz_results').insert({
    student_id: studentId,
    topic_id: topicId,
    score: result.score,
    total: result.total,
    correct: result.correct,
    difficulty: result.difficulty || 'medium',
    questions: result.questions || [],
    answers: result.answers || []
  });
  if (error) console.error('Save quiz error:', error);
  return data;
}

export async function getQuizResultsDB(studentId, topicId = null) {
  if (!supabase) return [];
  let query = supabase.from('quiz_results')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });
  if (topicId) query = query.eq('topic_id', topicId);
  const { data, error } = await query;
  if (error) { console.error('Get quiz results error:', error); return []; }
  return data || [];
}

export async function saveChatHistory(studentId, topicId, messages) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('chat_history')
    .upsert({
      student_id: studentId,
      topic_id: topicId || 'general',
      messages: messages,
      updated_at: new Date().toISOString()
    }, { onConflict: 'student_id,topic_id' });
  if (error) console.error('Save chat error:', error);
  return data;
}

export async function getChatHistory(studentId, topicId) {
  if (!supabase) return [];
  const { data, error } = await supabase.from('chat_history')
    .select('messages')
    .eq('student_id', studentId)
    .eq('topic_id', topicId || 'general')
    .maybeSingle();
  if (error && error.code !== 'PGRST116') console.error('Get chat error:', error);
  return data?.messages || [];
}

export async function saveTopicProgress(studentId, topicId, timeSpent, completed = false) {
  if (!supabase) {
    console.warn('[Supabase] Client not initialized');
    return null;
  }
  const payload = {
    student_id: studentId,
    topic_id: topicId,
    time_spent: timeSpent,
    completed,
    updated_at: new Date().toISOString()
  };
  console.log('[Supabase] Upserting progress:', payload);

  const { data, error } = await supabase.from('topic_progress')
    .upsert(payload, { onConflict: 'student_id,topic_id' });
    
  if (error) {
    console.error(`[Supabase Error] saveTopicProgress for ${topicId}:`, error.message, error.details || '', error.hint || '');
    throw error;
  }
  console.log('[Supabase] Progress saved successfully:', data);
  return data;
}

export async function getTopicProgressDB(studentId, topicId = null) {
  if (!supabase) return [];
  console.log(`[Supabase] Fetching progress for student=${studentId}, topic=${topicId}`);
  let query = supabase.from('topic_progress')
    .select('*')
    .eq('student_id', studentId);
  
  if (topicId) {
    query = query.eq('topic_id', topicId).maybeSingle();
  }
  
  const { data, error } = await query;
  if (error && error.code !== 'PGRST116') {
    console.error('[Supabase Error] getTopicProgressDB:', error.message);
    return topicId ? null : [];
  }
  console.log('[Supabase] Progress data retrieved:', data);
  return data || (topicId ? null : []);
}

// ─── Admin Helpers ───

export async function getAllStudents() {
  if (!supabase) return [];
  const { data, error } = await supabase.from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: true });
  if (error) { console.error('Get students error:', error); return []; }
  return data || [];
}

export async function getAllQuizResults() {
  if (!supabase) return [];
  const { data, error } = await supabase.from('quiz_results')
    .select('*, profiles(username, full_name)')
    .order('created_at', { ascending: false });
  if (error) { console.error('Get all quiz results error:', error); return []; }
  return data || [];
}

export async function getStudentQuizResults(studentId) {
  if (!supabase) return [];
  const { data, error } = await supabase.from('quiz_results')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });
  if (error) { console.error('Get student results error:', error); return []; }
  return data || [];
}

// getStudentProgress removed. Use getTopicProgressDB(studentId) instead.

