// ═══════════════════════════════════════════════
// AI Service — Gemini API Integration
// ═══════════════════════════════════════════════

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// Models to try in order of preference
const MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro'
];

let workingModel = null;

function getApiKey() {
  // Try env variable first, then localStorage fallback
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey !== 'your_gemini_api_key_here' && envKey !== '') {
    const masked = envKey.substring(0, 8) + '...' + envKey.substring(envKey.length - 4);
    console.log(`[ChemBot] Using API Key from .env: ${masked}`);
    return envKey;
  }
  const localKey = localStorage.getItem('chemlab_api_key');
  if (localKey) {
    const masked = localKey.substring(0, 8) + '...' + localKey.substring(localKey.length - 4);
    console.log(`[ChemBot] Using API Key from localStorage: ${masked}`);
    return localKey;
  }
  console.warn('[ChemBot] ⚠️ No API key found in .env or localStorage');
  return null;
}

export function setApiKey(key) {
  localStorage.setItem('chemlab_api_key', key);
  workingModel = null; // Reset so we re-discover the model
}

export function hasApiKey() {
  return !!getApiKey();
}

async function callGemini(prompt, systemInstruction = '') {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }
  // Helper to try models in order
  const tryAllModels = async () => {
    for (const model of MODELS) {
      console.log(`[ChemBot] Trying model: ${model}...`);
      const result = await tryModel(model, apiKey, body);
      if (result !== null) {
        workingModel = model;
        console.log(`[ChemBot] ✅ Working model found: ${model}`);
        return result;
      }
    }
    return null;
  };

  // If we have a working model, try it first
  if (workingModel) {
    const result = await tryModel(workingModel, apiKey, body);
    if (result !== null) return result;
    
    // If the "working" model failed, reset and try everyone else
    console.warn(`[ChemBot] ⚠️ Previously working model "${workingModel}" failed. Re-discovering...`);
    workingModel = null;
  }

  return await tryAllModels();
}

async function tryModel(model, apiKey, body) {
  try {
    const url = `${API_BASE}/${model}:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errorBody = await res.text();
      console.warn(`[ChemBot] Model "${model}" returned ${res.status}: ${errorBody.slice(0, 200)}`);
      return null;
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.warn(`[ChemBot] Model "${model}" failed:`, err.message);
    return null;
  }
}

// ─── Lab Assistant (Chatbot) ───

export async function askLabAssistant(question, topicContext, language = 'en') {
  const langInstruction = language === 'cn'
    ? 'Respond in Traditional Chinese (繁體中文). Use simplified language suitable for secondary school students in Hong Kong.'
    : 'Respond in English. Use clear, simple language suitable for secondary school students.';

  const systemInstruction = `You are ChemBot, a friendly AI chemistry lab assistant for Hong Kong secondary school students (Form 1-3, ages ~12-15).
${langInstruction}

Key rules:
- Keep answers concise (2-4 paragraphs max)
- Use analogies students can relate to
- If relevant, reference the current experiment/simulation
- Use chemical equations when helpful
- Be encouraging and supportive
- If a question is outside chemistry, gently redirect`;

  const prompt = topicContext
    ? `The student is currently working on: "${topicContext.name}" (${topicContext.category}).
Learning objectives: ${topicContext.learningObjectives.join(', ')}.

Student's question: ${question}`
    : question;

  const response = await callGemini(prompt, systemInstruction);
  return response || getDemoResponse(question, language);
}

// ─── Auto-Assessment (Quiz Generation) ───

export async function generateQuiz(topic, difficulty = 'medium', count = 5, avoidQuestions = []) {
  const avoidClause = avoidQuestions.length > 0
    ? `\n\nIMPORTANT: Do NOT repeat any of these previously asked questions. Generate COMPLETELY DIFFERENT questions:\n${avoidQuestions.map((q, i) => `${i + 1}. "${q}"`).join('\n')}`
    : '';

  const systemInstruction = `You are a chemistry quiz generator for Hong Kong Form ${topic.form} students.
Generate exactly ${count} multiple-choice questions about "${topic.name}".
Difficulty: ${difficulty}.${avoidClause}

IMPORTANT: Respond ONLY with valid JSON in this exact format, no extra text:
{
  "questions": [
    {
      "question": "...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctIndex": 0,
      "explanation": "Brief explanation of the correct answer"
    }
  ]
}`;

  const prompt = `Topic: ${topic.name}
Description: ${topic.description}
Learning Objectives: ${topic.learningObjectives.join('; ')}
Keywords: ${topic.keywords.join(', ')}

Generate ${count} multiple-choice questions.`;

  const response = await callGemini(prompt, systemInstruction);
  if (response) {
    try {
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.error('Quiz parse error:', e);
    }
  }
  return getDemoQuiz(topic);
}

// ─── Auto-Assessment (Answer Evaluation) ───

export async function evaluateLabReport(topic, reportText) {
  const systemInstruction = `You are a chemistry teacher evaluating a student's lab report for the topic "${topic.name}" (Form ${topic.form}).
Provide constructive feedback in 2-3 paragraphs. Be encouraging but point out areas for improvement.
Score the report out of 10.

Respond in JSON: { "score": number, "feedback": "string", "strengths": ["..."], "improvements": ["..."] }`;

  const response = await callGemini(`Student's lab report:\n${reportText}`, systemInstruction);
  if (response) {
    try {
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.error('Report eval parse error:', e);
    }
  }
  return { score: 7, feedback: 'Good effort! Your understanding of the core concepts is solid.', strengths: ['Clear structure'], improvements: ['Add more detail to observations'] };
}

// ─── Dashboard Insights ───

export async function generateStudentInsight(studentData) {
  const systemInstruction = `You are an educational AI analyzing student performance in chemistry for Hong Kong Form 1-3.
Given the student's progress data, provide a brief, actionable insight for the teacher (2-3 sentences).
Focus on strengths, weaknesses, and specific recommendations.`;

  const prompt = `Student: ${studentData.name}
Topics completed: ${studentData.completedTopics.join(', ')}
Average quiz score: ${studentData.avgScore}%
Time spent: ${studentData.totalTimeMinutes} minutes
Weakest topics: ${studentData.weakTopics.join(', ')}
Strongest topics: ${studentData.strongTopics.join(', ')}`;

  const response = await callGemini(prompt, systemInstruction);
  return response || getDemoInsight(studentData);
}

// ─── Demo / Fallback Responses ───

// ─── Demo / Fallback Responses ───

function getDemoResponse(question, language) {
  const responses = {
    en: [
      "Great question! In chemistry, understanding the basics of particle theory helps us explain many phenomena. Particles are always moving — the faster they move, the more energy they have, which is why heating a substance can change its state from solid to liquid to gas.\n\nTry experimenting with the simulation to see how changing the temperature affects particle movement!",
      "That's a really important concept! When we talk about chemical reactions, we're describing how atoms rearrange to form new substances. The key principle is that atoms are never created or destroyed — they just rearrange. This is called the Law of Conservation of Mass.\n\nIn the simulation, try counting the atoms on each side of the equation to verify this!",
      "Excellent thinking! pH is a measure of how acidic or alkaline a solution is. The scale goes from 0 (very acidic) to 14 (very alkaline), with 7 being neutral (like pure water).\n\nWhen you add an acid to an alkali, they neutralize each other, forming a salt and water. Try adjusting the amounts in the simulation to see the pH change!",
      "Chemistry is truly fascinating! Did you know that everything you see around you is made of atoms? These tiny building blocks bond together in different ways to create every substance in the universe, from the air you breathe to the device you're using right now.\n\nI recommend exploring the 'Atomic Structure' lab to see these building blocks up close!",
      "I'm here to help! Whether you're stuck on a calculation or just curious about how a lab works, feel free to ask. Remember, in the chemistry lab, safety and observation are our best tools for learning.\n\nWhat part of this experiment is most interesting to you so far?"
    ],
    cn: [
      "好問題！在化學中，了解粒子理論的基礎有助於解釋許多現象。粒子總是在運動——它們移動得越快，能量就越大，這就是為什麼加熱物質可以將其狀態從固態改變為液態再到氣態。\n\n試著在模擬中實驗，看看改變溫度如何影響粒子運動！",
      "這是一個很重要的概念！當我們談論化學反應時，我們描述的是原子如何重新排列形成新物質。關鍵原則是原子永遠不會被創造或銷毀——它們只是重新排列。這被稱為質量守恆定律。\n\n在模擬中，試著數一數方程式兩邊的原子來驗證這一點！",
      "很好的思考！pH值是衡量溶液酸性或鹼性的指標。刻度從0（強酸性）到14（強鹼性），7是中性（如純水）。\n\n當你將酸加入鹼中時，它們會互相中和，形成鹽和水。試著在模擬中調整用量來觀察pH值的變化！",
      "化學真的很迷人！你知道你身邊看到的一切都是由原子組成的嗎？這些微小的建築塊以不同的方式結合在一起，創造了宇宙中的每一種物質，從你呼吸的空氣到你現在使用的設備。\n\n我建議探索「原子結構」實驗室，近距離觀察這些建築塊！",
      "很高興能為你提供幫助！無論你是在計算上遇到困難，還是只是好奇實驗室如何運作，都可以隨時提問。請記住，在化學實驗室中，安全和觀察是我們最好的學習工具。\n\n到目前為止，這個實驗的哪個部分對你來說最有趣？"
    ]
  };
  const pool = responses[language] || responses.en;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getDemoQuiz(topic) {
  // Pool of generic chemistry questions to shuffle
  const genericPool = [
    {
      question: "Which of the following is evidence of a chemical change?",
      options: ["A) Change in color", "B) Change in state", "C) Dissolving in water", "D) Breaking into smaller pieces"],
      correctIndex: 0,
      explanation: "A color change often indicates a new substance has been formed."
    },
    {
      question: "What is the result of neutralizing an acid with a base?",
      options: ["A) Salt and Hydrogen", "B) Salt and Oxygen", "C) Salt and Water", "D) Pure Acid"],
      correctIndex: 2,
      explanation: "Acid + Base → Salt + Water."
    },
    {
      question: "Which particle in an atom has a negative charge?",
      options: ["A) Proton", "B) Neutron", "C) Electron", "D) Nucleus"],
      correctIndex: 2,
      explanation: "Electrons carry a negative charge."
    },
    {
      question: "Which state of matter has a fixed volume but no fixed shape?",
      options: ["A) Solid", "B) Liquid", "C) Gas", "D) Plasma"],
      correctIndex: 1,
      explanation: "Liquids take the shape of their container but have a constant volume."
    },
    {
      question: "What does the atomic number represent?",
      options: ["A) Neutrons", "B) Protons", "C) Electrons", "D) Mass"],
      correctIndex: 1,
      explanation: "Atomic number = number of protons."
    },
    {
      question: "Which of these is a pure substance?",
      options: ["A) Air", "B) Salt Water", "C) Gold", "D) Milk"],
      correctIndex: 2,
      explanation: "Gold is an element."
    },
    {
      question: "What happens to particles when a liquid freezes?",
      options: ["A) They move faster", "B) They spread out", "C) They lose energy and move slower", "D) They disappear"],
      correctIndex: 2,
      explanation: "Freezing involves a loss of thermal energy."
    }
  ];

  // Specific pools for common topics
  const topicPools = {
    'f1-01': [ // States of Matter
      {
        question: "What is the process of a solid turning directly into a gas?",
        options: ["A) Melting", "B) Sublimation", "C) Evaporation", "D) Condensation"],
        correctIndex: 1,
        explanation: "Sublimation skips the liquid phase."
      },
      {
        question: "In which state are particles closest together?",
        options: ["A) Solid", "B) Liquid", "C) Gas", "D) Plasma"],
        correctIndex: 0,
        explanation: "Solids have the most tightly packed particles."
      }
    ],
    'f2-01': [ // Acids and Bases
      {
        question: "What is the pH of a neutral solution?",
        options: ["A) 0", "B) 7", "C) 14", "D) 1"],
        correctIndex: 1,
        explanation: "Neutral pH is 7."
      }
    ]
  };

  const topicId = (typeof topic === 'string') ? topic : (topic?.id || 'general');
  const pool = [...genericPool, ...(topicPools[topicId] || [])];
  
  // High-entropy shuffle
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return {
    questions: shuffled.slice(0, 5)
  };
}

function getDemoInsight(studentData) {
  const insights = [
    `${studentData.name} shows strong understanding in ${studentData.strongTopics[0] || 'several topics'} with an average score of ${studentData.avgScore}%. Consider providing additional practice in ${studentData.weakTopics[0] || 'weaker areas'} to build confidence. A targeted review session on these topics before the next assessment would be beneficial.`,
    `${studentData.name} has been actively engaged, spending ${studentData.totalTimeMinutes} minutes on simulations. Their performance in ${studentData.strongTopics[0] || 'key topics'} is excellent, but ${studentData.weakTopics[0] || 'some areas'} need more attention. Recommend pairing them with a peer tutor for collaborative learning.`,
    `Based on ${studentData.name}'s progress, they are on track for Form ${studentData.form || 1} chemistry. Their quiz average of ${studentData.avgScore}% indicates ${studentData.avgScore > 70 ? 'good comprehension' : 'areas needing improvement'}. Suggest focusing on ${studentData.weakTopics[0] || 'foundational concepts'} in the next lab session.`
  ];
  return insights[Math.floor(Math.random() * insights.length)];
}
