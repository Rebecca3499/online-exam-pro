function makeToken(user) {
  return Buffer.from(JSON.stringify({
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name
  })).toString('base64url');
}

function parseToken(token) {
  try {
    return JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const user = parseToken(token);
  if (!user) return res.status(401).json({ code: 401, message: '请先登录', data: null });
  req.user = user;
  return next();
}

function adminRequired(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ code: 403, message: '无管理员权限', data: null });
  }
  return next();
}

module.exports = { makeToken, authRequired, adminRequired };
