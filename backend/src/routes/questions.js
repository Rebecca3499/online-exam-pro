const express = require('express');
const { all, run } = require('../db');
const { adminRequired } = require('../middleware/auth');
const { normalizeQuestion } = require('../utils/scorer');

const router = express.Router();

function normalizeText(value) {
  return String(value ?? '').trim();
}

function normalizeJudgeAnswer(answer) {
  const text = normalizeText(answer).toLowerCase();
  if (['a', 'true', '正确'].includes(text)) return 'A';
  if (['b', 'false', '错误'].includes(text)) return 'B';
  return '';
}

function validateQuestionPayload(body) {
  const examId = Number(body.exam_id);
  const type = normalizeText(body.type);
  const title = normalizeText(body.title);
  const score = Number(body.score);
  const answer = normalizeText(body.answer);
  let options = Array.isArray(body.options) ? body.options.map((option) => normalizeText(option)) : [];

  if (!examId) return { message: '所属考试不能为空' };
  if (!title) return { message: '题干不能为空' };
  if (!type) return { message: '题型不能为空' };
  if (!['single', 'judge'].includes(type)) return { message: '题型不合法' };
  if (!Number.isFinite(score) || score <= 0) return { message: '分值必须大于 0' };
  if (!answer) return { message: '正确答案不能为空' };

  let normalizedAnswer = answer;
  if (type === 'single') {
    const nonEmptyOptions = options.filter(Boolean);
    if (nonEmptyOptions.length < 2) return { message: '单选题至少需要 2 个非空选项' };
    options = nonEmptyOptions;
    const answerIndex = normalizedAnswer.toUpperCase().charCodeAt(0) - 65;
    if (answerIndex < 0 || answerIndex >= options.length) return { message: '正确答案必须对应一个非空选项' };
    normalizedAnswer = normalizedAnswer.toUpperCase();
  }

  if (type === 'judge') {
    normalizedAnswer = normalizeJudgeAnswer(answer);
    if (!normalizedAnswer) return { message: '判断题答案只能是 true/false 或 正确/错误' };
    options = ['正确', '错误'];
  }

  return {
    value: {
      exam_id: examId,
      type,
      title,
      options,
      answer: normalizedAnswer,
      score,
      analysis: normalizeText(body.analysis)
    }
  };
}

router.get('/questions', adminRequired, async (req, res, next) => {
  try {
    const params = [];
    const conditions = [];
    if (req.query.type) {
      conditions.push('q.type = ?');
      params.push(req.query.type);
    }
    if (req.query.exam_id) {
      conditions.push('q.exam_id = ?');
      params.push(req.query.exam_id);
    }
    if (req.query.keyword) {
      conditions.push('q.title LIKE ?');
      params.push(`%${req.query.keyword}%`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = await all(`SELECT q.*, e.title AS exam_title FROM questions q LEFT JOIN exams e ON e.id = q.exam_id ${where} ORDER BY q.id DESC`, params);
    res.json({ code: 0, message: 'ok', data: rows.map(normalizeQuestion) });
  } catch (err) {
    next(err);
  }
});

router.post('/questions', adminRequired, async (req, res, next) => {
  try {
    const validated = validateQuestionPayload(req.body);
    if (validated.message) return res.status(400).json({ code: 400, message: validated.message, data: null });
    const { exam_id, type, title, options, answer, score, analysis } = validated.value;
    const result = await run(
      'INSERT INTO questions (exam_id, type, title, options, answer, score, analysis) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [exam_id, type, title, JSON.stringify(options || []), answer, score, analysis || '']
    );
    res.json({ code: 0, message: '创建成功', data: { id: result.id } });
  } catch (err) {
    next(err);
  }
});

router.put('/questions/:id', adminRequired, async (req, res, next) => {
  try {
    const validated = validateQuestionPayload(req.body);
    if (validated.message) return res.status(400).json({ code: 400, message: validated.message, data: null });
    const { exam_id, type, title, options, answer, score, analysis } = validated.value;
    await run(
      'UPDATE questions SET exam_id = ?, type = ?, title = ?, options = ?, answer = ?, score = ?, analysis = ? WHERE id = ?',
      [exam_id, type, title, JSON.stringify(options || []), answer, score, analysis || '', req.params.id]
    );
    res.json({ code: 0, message: '更新成功', data: null });
  } catch (err) {
    next(err);
  }
});

router.delete('/questions/:id', adminRequired, async (req, res, next) => {
  try {
    await run('DELETE FROM questions WHERE id = ?', [req.params.id]);
    res.json({ code: 0, message: '删除成功', data: null });
  } catch (err) {
    next(err);
  }
});

router.post('/questions/import', adminRequired, async (req, res, next) => {
  try {
    const items = Array.isArray(req.body) ? req.body : req.body.items;
    if (!Array.isArray(items)) return res.status(400).json({ code: 400, message: '导入数据必须是数组', data: null });
    for (const item of items) {
      const validated = validateQuestionPayload(item);
      if (validated.message) return res.status(400).json({ code: 400, message: validated.message, data: null });
      const { exam_id, type, title, options, answer, score, analysis } = validated.value;
      await run(
        'INSERT INTO questions (exam_id, type, title, options, answer, score, analysis) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [exam_id, type, title, JSON.stringify(options || []), answer, score, analysis || '']
      );
    }
    res.json({ code: 0, message: `成功导入 ${items.length} 道题`, data: { count: items.length } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
