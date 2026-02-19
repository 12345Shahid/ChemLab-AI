// ═══════════════════════════════════════════════
// Storage Service — localStorage Wrapper
// ═══════════════════════════════════════════════

const STORAGE_KEYS = {
  PROGRESS: 'chemlab_progress',
  QUIZ_RESULTS: 'chemlab_quizzes',
  STUDENTS: 'chemlab_students',
  SETTINGS: 'chemlab_settings'
};

// ─── Progress Tracking ───

export function saveProgress(studentId, topicId, data) {
  const progress = getAllProgress();
  if (!progress[studentId]) progress[studentId] = {};
  progress[studentId][topicId] = {
    ...progress[studentId][topicId],
    ...data,
    lastAccessed: Date.now()
  };
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
}

export function getProgress(studentId) {
  const progress = getAllProgress();
  return progress[studentId] || {};
}

export function getAllProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || '{}');
  } catch {
    return {};
  }
}

export function getTopicProgress(studentId, topicId) {
  const progress = getProgress(studentId);
  return progress[topicId] || { timeSpent: 0, completed: false, visits: 0 };
}

export function trackTimeSpent(studentId, topicId, seconds) {
  const current = getTopicProgress(studentId, topicId);
  saveProgress(studentId, topicId, {
    timeSpent: (current.timeSpent || 0) + seconds,
    visits: (current.visits || 0) + 1
  });
}

export function markTopicCompleted(studentId, topicId) {
  saveProgress(studentId, topicId, { completed: true, completedAt: Date.now() });
}

// ─── Quiz Results ───

export function saveQuizResult(studentId, topicId, result) {
  const results = getAllQuizResults();
  if (!results[studentId]) results[studentId] = {};
  if (!results[studentId][topicId]) results[studentId][topicId] = [];
  results[studentId][topicId].push({
    ...result,
    timestamp: Date.now()
  });
  localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(results));
}

export function getQuizResults(studentId) {
  const results = getAllQuizResults();
  return results[studentId] || {};
}

export function getAllQuizResults() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS) || '{}');
  } catch {
    return {};
  }
}

export function getBestScore(studentId, topicId) {
  const results = getQuizResults(studentId);
  const topicResults = results[topicId] || [];
  if (topicResults.length === 0) return null;
  return Math.max(...topicResults.map(r => r.score));
}

// ─── Student Management ───

export function getAllStudents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
  } catch {
    return [];
  }
}

export function addStudent(student) {
  const students = getAllStudents();
  if (!students.find(s => s.id === student.id)) {
    students.push(student);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }
}

export function getCurrentStudent() {
  const settings = getSettings();
  return settings.currentStudentId || 'demo-student';
}

export function setCurrentStudent(studentId) {
  const settings = getSettings();
  settings.currentStudentId = studentId;
  saveSettings(settings);
}

// ─── Settings ───

export function getSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
  } catch {
    return {};
  }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// ─── Demo Data Generation ───

export function generateDemoData() {
  const students = [
    { id: 'student-1', name: 'Chan Mei Ling', form: 1, nameEn: 'Mei Ling Chan' },
    { id: 'student-2', name: 'Wong Ka Ho', form: 1, nameEn: 'Ka Ho Wong' },
    { id: 'student-3', name: 'Li Hoi Yee', form: 2, nameEn: 'Hoi Yee Li' },
    { id: 'student-4', name: 'Cheung Tsz Hin', form: 2, nameEn: 'Tsz Hin Cheung' },
    { id: 'student-5', name: 'Lam Wing Yan', form: 1, nameEn: 'Wing Yan Lam' },
    { id: 'student-6', name: 'Ng Hau Yi', form: 3, nameEn: 'Hau Yi Ng' },
    { id: 'student-7', name: 'Leung Chun Wai', form: 3, nameEn: 'Chun Wai Leung' },
    { id: 'student-8', name: 'Yip Sze Man', form: 2, nameEn: 'Sze Man Yip' },
    { id: 'student-9', name: 'Tam Lok Hei', form: 1, nameEn: 'Lok Hei Tam' },
    { id: 'student-10', name: 'Fung Pui Ying', form: 3, nameEn: 'Pui Ying Fung' }
  ];

  const topicIds = {
    1: ['f1-01', 'f1-02', 'f1-03', 'f1-04', 'f1-05', 'f1-06', 'f1-07', 'f1-08', 'f1-09', 'f1-10'],
    2: ['f2-01', 'f2-02', 'f2-03', 'f2-04', 'f2-05', 'f2-06', 'f2-07', 'f2-08', 'f2-09'],
    3: ['f3-01', 'f3-02', 'f3-03', 'f3-04', 'f3-05', 'f3-06', 'f3-07', 'f3-08', 'f3-09', 'f3-10', 'f3-11', 'f3-12', 'f3-13']
  };

  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));

  const progress = {};
  const quizResults = {};

  students.forEach(student => {
    progress[student.id] = {};
    quizResults[student.id] = {};

    const formTopics = topicIds[student.form];
    const numCompleted = Math.floor(Math.random() * formTopics.length * 0.7) + 2;

    for (let i = 0; i < Math.min(numCompleted, formTopics.length); i++) {
      const topicId = formTopics[i];
      const timeSpent = Math.floor(Math.random() * 1800) + 300;
      const completed = Math.random() > 0.3;

      progress[student.id][topicId] = {
        timeSpent,
        completed,
        visits: Math.floor(Math.random() * 5) + 1,
        lastAccessed: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
      };

      if (completed) {
        const score = Math.floor(Math.random() * 60) + 40;
        quizResults[student.id][topicId] = [{
          score,
          total: 5,
          correct: Math.round(score / 20),
          timestamp: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
        }];
      }
    }
  });

  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(quizResults));

  return { students, progress, quizResults };
}

// ─── Dashboard Aggregation ───

export function getStudentSummary(studentId) {
  const progress = getProgress(studentId);
  const quizzes = getQuizResults(studentId);
  const students = getAllStudents();
  const student = students.find(s => s.id === studentId);

  const completedTopics = Object.entries(progress)
    .filter(([, data]) => data.completed)
    .map(([id]) => id);

  const allScores = Object.values(quizzes)
    .flat()
    .map(q => q.score);

  const avgScore = allScores.length > 0
    ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
    : 0;

  const totalTimeMinutes = Math.round(
    Object.values(progress).reduce((sum, p) => sum + (p.timeSpent || 0), 0) / 60
  );

  // Determine strong/weak topics by score
  const topicScores = {};
  Object.entries(quizzes).forEach(([topicId, results]) => {
    topicScores[topicId] = Math.max(...results.map(r => r.score));
  });

  const sortedTopics = Object.entries(topicScores).sort(([, a], [, b]) => b - a);
  const strongTopics = sortedTopics.slice(0, 3).map(([id]) => id);
  const weakTopics = sortedTopics.slice(-3).map(([id]) => id);

  return {
    id: studentId,
    name: student?.name || studentId,
    form: student?.form || 1,
    completedTopics,
    avgScore,
    totalTimeMinutes,
    strongTopics,
    weakTopics,
    totalTopicsAttempted: Object.keys(progress).length,
    quizzesTaken: allScores.length
  };
}
