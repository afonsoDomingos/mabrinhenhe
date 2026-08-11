const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mabrinhenhe2026';

const requireAdmin = (req, res, next) => {
  const password = req.headers['x-admin-password'];
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Não autorizado. Senha de admin inválida.' });
  }
  next();
};

module.exports = { requireAdmin };
