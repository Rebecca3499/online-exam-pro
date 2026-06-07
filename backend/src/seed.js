const { initDb, run } = require('./db');

const questions = [
  {
    type: 'single',
    title: 'Vue 3 中用于创建响应式引用的 API 是？',
    options: ['reactiveRef', 'ref', 'state', 'observable'],
    answer: 'B',
    score: 10,
    analysis: 'ref 用于创建可响应的基本类型或对象引用，模板中会自动解包。'
  },
  {
    type: 'single',
    title: 'Pinia 的核心作用主要是？',
    options: ['路由跳转', '全局状态管理', 'HTTP 请求', '代码打包'],
    answer: 'B',
    score: 10,
    analysis: 'Pinia 是 Vue 官方推荐的状态管理库，适合保存登录信息、考试状态等。'
  },
  {
    type: 'judge',
    title: 'Vue Router 可以通过 beforeEach 实现全局路由守卫。',
    options: ['正确', '错误'],
    answer: 'A',
    score: 10,
    analysis: 'beforeEach 会在每次路由切换前执行，常用于登录校验和权限控制。'
  },
  {
    type: 'single',
    title: 'Axios 拦截器常用于以下哪类场景？',
    options: ['统一添加 Token 和处理错误', '编译 TypeScript', '生成图表', '创建数据库表'],
    answer: 'A',
    score: 10,
    analysis: '请求拦截器可以统一添加 Authorization，响应拦截器可以统一处理接口错误。'
  },
  {
    type: 'judge',
    title: 'localStorage 刷新页面后数据会立即丢失。',
    options: ['正确', '错误'],
    answer: 'B',
    score: 10,
    analysis: 'localStorage 是持久化存储，除非主动清除，否则刷新页面后仍会保留。'
  },
  {
    type: 'single',
    title: 'ECharts 最适合在本项目中承担什么职责？',
    options: ['成绩可视化分析', '用户登录认证', 'PDF 导出', '数据库迁移'],
    answer: 'A',
    score: 10,
    analysis: 'ECharts 可用于绘制分数段、趋势线、错误率排行榜等图表。'
  },
  {
    type: 'judge',
    title: 'RESTful API 通常使用不同 HTTP 方法表达资源操作。',
    options: ['正确', '错误'],
    answer: 'A',
    score: 10,
    analysis: 'GET、POST、PUT、DELETE 分别常用于查询、创建、更新和删除。'
  },
  {
    type: 'single',
    title: 'TypeScript 相比 JavaScript 的重要优势是？',
    options: ['提供静态类型检查', '自动替代后端', '不需要浏览器', '只能写 CSS'],
    answer: 'A',
    score: 10,
    analysis: 'TypeScript 通过类型系统帮助在开发阶段发现数据结构和调用错误。'
  },
  {
    type: 'judge',
    title: 'Vite 在开发环境中通常具有较快的冷启动和热更新速度。',
    options: ['正确', '错误'],
    answer: 'A',
    score: 10,
    analysis: 'Vite 基于原生 ESM 和高效构建工具，开发体验很轻快。'
  },
  {
    type: 'single',
    title: 'Element Plus 是什么类型的库？',
    options: ['Vue 3 UI 组件库', '数据库引擎', '后端框架', '命令行操作系统'],
    answer: 'A',
    score: 10,
    analysis: 'Element Plus 提供表单、表格、弹窗、消息提示等常用 Vue 3 组件。'
  }
];

async function seed() {
  await initDb();
  await run('DELETE FROM submissions');
  await run('DELETE FROM questions');
  await run('DELETE FROM exams');
  await run('DELETE FROM users');
  await run("DELETE FROM sqlite_sequence WHERE name IN ('users', 'exams', 'questions', 'submissions')");

  await run('INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)', ['admin', '123456', 'admin', '管理员']);
  await run('INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)', ['student', '123456', 'student', '张同学']);

  const exam = await run(
    'INSERT INTO exams (title, description, duration, total_score, is_random, is_published) VALUES (?, ?, ?, ?, ?, ?)',
    ['前端工程综合能力测验', '覆盖 Vue 3、工程化、状态管理、接口请求与可视化的综合练习。', 45, 100, 1, 1]
  );
  const exam2 = await run(
    'INSERT INTO exams (title, description, duration, total_score, is_random, is_published) VALUES (?, ?, ?, ?, ?, ?)',
    ['Web 基础快速自测', '适合课前热身的短测，重点考察基础概念。', 20, 40, 0, 1]
  );

  for (const q of questions) {
    await run(
      'INSERT INTO questions (exam_id, type, title, options, answer, score, analysis) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [exam.id, q.type, q.title, JSON.stringify(q.options), q.answer, q.score, q.analysis]
    );
  }

  for (const q of questions.slice(0, 4)) {
    await run(
      'INSERT INTO questions (exam_id, type, title, options, answer, score, analysis) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [exam2.id, q.type, q.title, JSON.stringify(q.options), q.answer, 10, q.analysis]
    );
  }

  console.log('Seed data created. Login: admin/123456, student/123456');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
