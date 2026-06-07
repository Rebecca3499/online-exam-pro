const { all, get } = require('../db');

function parseOptions(options) {
  try {
    return JSON.parse(options);
  } catch {
    return [];
  }
}

function normalizeQuestion(row) {
  return {
    ...row,
    options: parseOptions(row.options),
    is_random: Number(row.is_random || 0),
    is_published: Number(row.is_published || 0)
  };
}

async function scoreSubmission(examId, answers) {
  const exam = await get('SELECT * FROM exams WHERE id = ?', [examId]);
  if (!exam) throw new Error('考试不存在');
  const questions = await all('SELECT * FROM questions WHERE exam_id = ? ORDER BY id ASC', [examId]);
  let score = 0;
  let correctCount = 0;
  const detail = questions.map((q) => {
    const userAnswer = answers[String(q.id)] ?? '';
    const isCorrect = String(userAnswer) === String(q.answer);
    if (isCorrect) {
      score += Number(q.score);
      correctCount += 1;
    }
    return {
      questionId: q.id,
      title: q.title,
      type: q.type,
      options: parseOptions(q.options),
      userAnswer,
      correctAnswer: q.answer,
      score: q.score,
      isCorrect,
      analysis: q.analysis || ''
    };
  });
  const wrongCount = Math.max(questions.length - correctCount, 0);
  const accuracy = questions.length ? Number(((correctCount / questions.length) * 100).toFixed(2)) : 0;
  return {
    exam,
    totalScore: Number(exam.total_score),
    score,
    correctCount,
    wrongCount,
    accuracy,
    detail
  };
}

module.exports = { scoreSubmission, normalizeQuestion, parseOptions };
