const request = require('supertest'); // Importando a Biblioteca para fazer requisiçoes
const { expect, use } = require('chai'); // Importando a Biblioteca de asserções e passando o use(Função que tem poderes) para poder usar o CHAIEXLUDE
const { query } = require('express');
require('dotenv').config(); // Importando o dotENV

const chaiExclude = require('chai-exclude').default; // Importando o chaiExlude
use(chaiExclude); // Passando o ChaiExClude para dentro do CHAI(USE)

describe('Teste de Transferência', () => {
    beforeEach(async () => { // Esse before será rodado uma vez antes de cada IT
        const loginUser = require('../fixture/requisicoes/login/loginUser.json'); // Importante a FIXTURE COM os dados.
        const resposta = await request(process.env.BASE_URL_GRAPHQL) // Passando a URL do servidor
            .post('') // É o caminho/rota/url da API
            .send(loginUser);

        this.token = resposta.body.data.login.token // Passando o token para a variavél Token
    })

    beforeEach(async () => { // Esse before será rodado uma vez antes de cada IT
        createTransfer = require('../fixture/requisicoes/transferencia/createTransfer.json'); // Importante a FIXTURE COM os dados.
    })

    it('Validar que é possível transferir grana entre duas contas', async () => {
        const respostaEsperada = require('../fixture/respostas/transferencia/validarQueEPossivelTransfereirGranaEntreDuasPessoas.json'); // Importe arquivos de resposta 

        const respostaTransferencia = await request(process.env.BASE_URL_GRAPHQL) // Passando a URL fixa do .ENV
            // Escrever o teste: Enviando requisição, para tranferencia
            .post('')  // É o caminho/rota/url da API
            .set('Authorization', `Bearer ${this.token}`) //Passando o token na Authorization
            .send(createTransfer);

        expect(respostaTransferencia.status).to.equal(200); // Validando o status code
        expect(respostaEsperada.data.transfer)
            .excluding('date') // Removendo o Date da resposta obtida
            .to.deep.equal(respostaEsperada.data.transfer)
    });

    it('Não é possível transferir valor maior que o saldo', async () => {
        createTransfer.variables.amount = 10000.01; // Alterando o valor dentro do testes
        const respostaTransferencia = await request(process.env.BASE_URL_GRAPHQL)
            .post('')  // É o caminho/rota/url da API
            .set('Authorization', `Bearer ${this.token}`)
            .send(createTransfer);

        expect(respostaTransferencia.status).to.equal(200);
        expect(respostaTransferencia.body.errors[0].message).to.equal('Saldo insuficiente'); // Pegando a 'ERROS' e pegando o primerio Item da sua Lista, com veridicando o valor desse item

    });
})