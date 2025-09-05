// userController.js
const userService = require('../service/userService');

exports.register = (req, res) => {
  const { username, password, isFavored } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }
  const result = userService.registerUser({ username, password, isFavored });
  if (result.error) {
    return res.status(409).json({ error: result.error });
  }
  res.status(201).json({ user: result.user });
};

const jwt = require('jsonwebtoken');
const { SECRET } = require('../middleware/authMiddleware');

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }
  const result = userService.authenticateUser({ username, password });
  if (result.error) {
    return res.status(401).json({ error: result.error });
  }
  // Gera o token JWT
  const token = jwt.sign({ username: result.user.username }, SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login realizado com sucesso', token, user: result.user });
};

exports.list = (req, res) => {
  res.json(userService.listUsers());
};
