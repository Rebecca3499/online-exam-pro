const express = require('express');
const { all, run } = require('../db');
const { adminRequired } = require('../middleware/auth');
const { normalizeQuestion } = require('../utils/scorer');

const router = express.Router();

router.get('/questions', async (req, res, next) => {
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
    const { exam_id, type, title, options, answer, score, analysis } = req.body;
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
    const { exam_id, type, title, options, answer, score, analysis } = req.body;
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
      await run(
        'INSERT INTO questions (exam_id, type, title, options, answer, score, analysis) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [item.exam_id, item.type, item.title, JSON.stringify(item.options || []), item.answer, item.score, item.analysis || '']
      );
    }
    res.json({ code: 0, message: `成功导入 ${items.length} 道题`, data: { count: items.length } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
