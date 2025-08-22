// transferService.js

const { users } = require('../model/userModel');
const { transfers } = require('../model/transferModel');

function transfer({ from, to, amount }) {
  const sender = users.find(u => u.username === from);
  const recipient = users.find(u => u.username === to);
  if (!sender || !recipient) {
    throw new Error('Usuário remetente ou destinatário não encontrado');
  }
  if (sender.balance < amount) {
    throw new Error('Saldo insuficiente');
  }
  if (!recipient.isFavored && amount >= 5000) {
    throw new Error('Transferências acima de R$ 5.000,00 só são permitidas para favorecidos');
  }

  // Exemplo de sucesso
  sender.balance -= amount;
  recipient.balance += amount;
  const transfer = { from, to, amount, date: new Date() };
  transfers.push(transfer);
  return { transfer };
}

function listTransfers() {
  return transfers;
}

module.exports = {
  transfer,
  listTransfers
};
