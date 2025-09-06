const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

function authMiddlewareGraphql(req, res, next) {
  req.user = null;
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, SECRET);
    } catch (e) {
      // Token inválido, req.user permanece null
    }
  }
  next();
}

function requireAuth(user) {
  if (!user) throw new Error('Não autenticado');
}

module.exports = { authMiddlewareGraphql, requireAuth, SECRET };
