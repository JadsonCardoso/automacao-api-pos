// userModel.js
// In-memory user and transfer data

const users = [
  {
    username: 'jadson',
    password: '123456',
    isFavored: ['yasmin'],
    balance: 10000
  },
  {
    username: 'yasmin',
    password: '123456',
    isFavored: ['jadson'],
    balance: 10000
  },
  {
    username: 'joao',
    password: '123456',
    balance: 10000
  },
];

module.exports = {
  users,
};
