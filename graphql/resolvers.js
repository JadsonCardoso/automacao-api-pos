const userService = require('../service/userService');
const transferService = require('../service/transferService');
const jwt = require('jsonwebtoken');
const { SECRET, requireAuth } = require('./auth');

module.exports = {
  Query: {
    users: () => userService.listUsers(),
    transfers: (parent, args, context) => {
      requireAuth(context.user);
      return transferService.listTransfers();
    },
  },
  Mutation: {
    register: (parent, { username, password, isFavored }) => {
      const result = userService.registerUser({ username, password, isFavored });
      if (result.error) throw new Error(result.error);
      return result.user;
    },
    login: (parent, { username, password }) => {
      const result = userService.authenticateUser({ username, password });
      if (result.error) throw new Error(result.error);
      const token = jwt.sign({ username: result.user.username }, SECRET, { expiresIn: '1h' });
      return { token, user: result.user };
    },
    transfer: (parent, { from, to, amount }, context) => {
      requireAuth(context.user);
      // O usuário autenticado só pode transferir do próprio usuário
      if (context.user.username !== from) throw new Error('Token não corresponde ao usuário de origem');
      return transferService.transfer({ from, to, amount }).transfer;
    },
  },
};
