const express = require('express');
const { all, get, run } = require('../db');
const { adminRequired } = require('../middleware/auth');
const { normalizeQuestion } = require('../utils/scorer');

const router = express.Router();

function normalizeExam(row) {
  return {
    ...row,
    is_random: Boolean(row.is_random),
    is_published: Boolean(row.is_published),
    question_count: row.question_count || 0
  };
}

router.get('/exams', async (req, res, next) => {
  try {
    const where = req.user.role === 'student' || req.query.published === '1' ? 'WHERE e.is_published = 1' : '';
    const rows = await all(`SELECT e.*, COUNT(q.id) AS question_count
      FROM exams e LEFT JOIN questions q ON q.exam_id = e.id
      ${where}
      GROUP BY e.id ORDER BY e.created_at DESC`);
    res.json({ code: 0, message: 'ok', data: rows.map(normalizeExam) });
  } catch (err) {
    next(err);
  }
});

router.get('/exams/:id', async (req, res, next) => {
  try {
    const exam = await get('SELECT * FROM exams WHERE id = ?', [req.params.id]);
    if (!exam) return res.status(404).json({ code: 404, message: '考试不存在', data: null });
    if (req.user.role === 'student' && !exam.is_published) {
      return res.status(403).json({ code: 403, message: '该考试尚未发布', data: null });
    }
    let questions = await all('SELECT * FROM questions WHERE exam_id = ? ORDER BY id ASC', [req.params.id]);
    if (exam.is_random) questions = questions.sort(() => Math.random() - 0.5);
    const safeQuestions = questions.map(normalizeQuestion).map((question) => {
      if (req.user.role !== 'student') return question;
      const { answer, analysis, ...safe } = question;
      return safe;
    });
    res.json({ code: 0, message: 'ok', data: { ...normalizeExam(exam), questions: safeQuestions } });
  } catch (err) {
    next(err);
  }
});

router.post('/exams', adminRequired, async (req, res, next) => {
  try {
    const { title, description, duration, total_score, is_random, is_published } = req.body;
    const result = await run(
      'INSERT INTO exams (title, description, duration, total_score, is_random, is_published) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description || '', duration, total_score, is_random ? 1 : 0, is_published ? 1 : 0]
    );
    res.json({ code: 0, message: '创建成功', data: { id: result.id } });
  } catch (err) {
    next(err);
  }
});

router.put('/exams/:id', adminRequired, async (req, res, next) => {
  try {
    const { title, description, duration, total_score, is_random, is_published } = req.body;
    await run(
      'UPDATE exams SET title = ?, description = ?, duration = ?, total_score = ?, is_random = ?, is_published = ? WHERE id = ?',
      [title, description || '', duration, total_score, is_random ? 1 : 0, is_published ? 1 : 0, req.params.id]
    );
    res.json({ code: 0, message: '更新成功', data: null });
  } catch (err) {
    next(err);
  }
});

router.delete('/exams/:id', adminRequired, async (req, res, next) => {
  try {
    await run('DELETE FROM exams WHERE id = ?', [req.params.id]);
    res.json({ code: 0, message: '删除成功', data: null });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
