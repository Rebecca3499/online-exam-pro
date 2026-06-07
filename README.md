# 智测云 Online Exam Pro

智测云 Online Exam Pro 是一个前后端分离的在线考试与成绩分析平台，覆盖管理员出题组卷、考生在线考试、倒计时、防切屏、自动保存、自动批改、成绩分析和 PDF 报告导出，适合作为前端开发综合实践课程展示项目。

## 技术栈

前端：Vue 3、Vite、TypeScript、Pinia、Vue Router、Element Plus、Axios、ECharts、jsPDF、localStorage、响应式布局。

后端：Node.js、Express、SQLite、RESTful API、本地 seed 数据。

## 功能亮点

- 双角色登录：管理员与考生自动进入不同工作台。
- 完整权限控制：未登录跳转登录页，跨角色访问跳转 403。
- 管理员端：Dashboard 数据卡片、考试 CRUD、题目 CRUD、JSON 批量导入、成绩管理、成绩分析图表。
- 考生端：已发布考试列表、考试须知、沉浸式答题、倒计时、自动保存、刷新恢复、防切屏计数、自动提交。
- 自动批改：后端按题目正确答案计算得分、正确率、错题解析。
- 报告导出：成绩页可使用 jsPDF 导出 PDF 报告。
- 数据可视化：使用 ECharts 展示分数段分布、平均分趋势、高错题排行。

## 项目结构

```text
online-exam-pro/
  frontend/          Vue 3 + Vite 前端
  backend/           Express + SQLite 后端
  README.md
```

## 安装与运行

推荐使用 Node.js 20 LTS。项目根目录已提供 `.nvmrc`：

```bash
cd online-exam-pro
nvm use
```

后端：

```bash
cd backend
npm install
npm run seed
npm run dev
```

前端：

```bash
cd frontend
npm install
npm run dev
```

访问地址：

- 前端：http://localhost:5173
- 后端：http://localhost:3000

前端 `/api` 请求已通过 Vite proxy 转发到 `http://localhost:3000`。

## WSL 运行排错

如果在 WSL 中执行 `npm install` 或 `npm run seed` 时出现下面这类错误：

```text
UNC 路径不受支持
Cannot find module 'C:\Windows\src\seed.js'
gyp ERR! cwd C:\Windows
```

说明当前 WSL 调用到了 Windows 版 Node/npm。Windows CMD 无法把 `\\wsl.localhost\...` 作为脚本工作目录，SQLite 的 native 依赖也会被错误地按 Windows 环境编译。

请在 WSL 里安装并使用 Linux 版 Node 20：

```bash
which node
which npm
```

如果输出路径包含 `/mnt/c/`、`Program Files` 或没有输出，请执行：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
cd ~/qianduan/online-exam-pro
nvm install
nvm use
```

然后删除之前由 Windows npm 生成的残留依赖并重新安装：

```bash
cd ~/qianduan/online-exam-pro/backend
rm -rf node_modules package-lock.json
npm install
npm run seed
npm run dev
```

另开一个 WSL 终端启动前端：

```bash
cd ~/qianduan/online-exam-pro/frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 测试账号

- 管理员：`admin` / `123456`
- 考生：`student` / `123456`

## 主要页面说明

- `/login`：登录页，支持管理员和考生账号。
- `/admin/dashboard`：后台首页，展示考试总数、题目总数、提交人数、平均分和图表。
- `/admin/exams`：考试管理，支持创建、编辑、删除、发布、随机题序设置。
- `/admin/questions`：题目管理，支持新增、编辑、删除、搜索、题型筛选和 JSON 导入。
- `/admin/results`：成绩管理，展示考生提交记录、得分、正确率、超时和切屏次数。
- `/admin/analysis`：成绩分析，展示分数段、趋势、高错题排行。
- `/student/exams`：考生考试列表。
- `/student/exams/:id/intro`：考试须知页。
- `/student/exams/:id/take`：在线答题页，支持自动保存、倒计时和防切屏。
- `/student/results/:id`：成绩结果页，支持导出 PDF 报告。

## API 接口说明

- `POST /api/login`：登录。
- `GET /api/exams`：考试列表。
- `GET /api/exams/:id`：考试详情，包含题目。
- `POST /api/exams`：创建考试。
- `PUT /api/exams/:id`：更新考试。
- `DELETE /api/exams/:id`：删除考试。
- `GET /api/questions`：题目列表。
- `POST /api/questions`：新增题目。
- `PUT /api/questions/:id`：更新题目。
- `DELETE /api/questions/:id`：删除题目。
- `POST /api/questions/import`：批量导入题目。
- `POST /api/exam/submit`：提交考试并自动批改。
- `GET /api/results`：成绩列表。
- `GET /api/results/:id`：成绩详情。
- `GET /api/analysis/summary`：统计分析汇总。

## 课堂展示建议

1. 先用管理员账号进入后台首页，展示统计卡片和图表。
2. 在考试管理中新建或编辑考试，演示发布、随机题序等配置。
3. 在题目管理中新增一道题，再下载示例 JSON 并演示批量导入。
4. 切换考生账号，从考试列表进入考试须知页。
5. 在答题页选择答案，刷新页面展示自动恢复作答进度。
6. 切换浏览器标签页或窗口，展示切屏提醒与计数。
7. 手动提交或等待倒计时结束，展示自动批改结果。
8. 在成绩页导出 PDF 报告，再回到管理员端查看成绩管理与分析页。
