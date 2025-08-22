// transferController.js
const transferService = require('../service/transferService');

exports.transfer = (req, res) => {
  try {
    const { from, to, amount } = req.body;
    if (!from || !to || typeof amount !== 'number') {
      return res.status(400).json({ error: 'Campos obrigatórios: from, to, amount (number)' });
    }
    const result = transferService.transfer({ from, to, amount });
    res.status(201).json(result); // Agora retorna o objeto direto
  } catch (err) {
    // Erros de negócio conhecidos
    const mensagensNegocio = [
      'Usuário remetente ou destinatário não encontrado',
      'Saldo insuficiente',
      'Transferências acima de R$ 5.000,00 só são permitidas para favorecidos'
    ];
    if (mensagensNegocio.includes(err.message)) {
      return res.status(400).json({ error: err.message });
    }
    // Erros inesperados
    res.status(500).json({ error: 'Erro interno ao processar transferência', details: err.message });
  }
};

exports.list = (req, res) => {
  res.json(transferService.listTransfers());
};
