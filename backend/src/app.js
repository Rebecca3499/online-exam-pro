const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');
const authRoutes = require('./routes/auth');
const examRoutes = require('./routes/exams');
const questionRoutes = require('./routes/questions');
const resultRoutes = require('./routes/results');
const { authRequired } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/', (req, res) => {
  res.json({ code: 0, message: 'Online Exam Pro API is running', data: null });
});

app.use('/api', authRoutes);
app.use('/api', authRequired, examRoutes);
app.use('/api', authRequired, questionRoutes);
app.use('/api', authRequired, resultRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ code: 500, message: err.message || '服务器错误', data: null });
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Online Exam Pro backend running at http://localhost:${PORT}`);
  });
});
