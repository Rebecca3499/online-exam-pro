const express = require('express');
const { get } = require('../db');
const { makeToken } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await get('SELECT id, username, role, name FROM users WHERE username = ? AND password = ?', [username, password]);
    if (!user) return res.status(401).json({ code: 401, message: '账号或密码错误', data: null });
    res.json({ code: 0, message: '登录成功', data: { token: makeToken(user), user } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
