// Bibliotecas
const request = require('supertest');
const { expect, use } = require('chai');
require('dotenv').config(); // Importando o dotENV

const chaiExclude = require('chai-exclude').default; // Importando o chaiExlude
use(chaiExclude); // Passando o ChaiExClude para dentro do CHAI(USE)


// Testes via HTTP
describe('Transfer', () => {
    describe('POST /transfer', () => {
        before(async () => { // Esse before será rodado uma vez antes de cada IT

            const postLogin = require('../fixture/requisicoes/login/postLogin.json') // Importando o arquivo JSON com os dados para LOGIN na variáriavel POSTLOGIN 
            // 1) Capturar o Token
            const respostaLogin = await request(process.env.BASE_URL_REST) // Passando a URL fixa do .ENV
                .post('/login')
                .send(postLogin) // Passando apenas a Variávels que tem o Objeto de login

            this.token = respostaLogin.body.token  // a respostaLogin.body.token, está pegando exatamente o token, e estamos passando ele para a variável TOKEN

        })


        it('Quando informo remetente e destinatario existentes recebo 201', async () => {
            const postTranfer = require('../fixture/requisicoes/transferencias/postTransferencias.json') // Importando o arquivo JSON com os dados para TRANFERIR na variáriavel postTranfer
            const respostaEsperada = require('../fixture/respostas/quandoInformoValoresValidadosEuTenhoSucessoCom201Created.json')

            const resposta = await request(process.env.BASE_URL_REST) // Passamos a URL da API ao invés do APP
                .post('/transfer')
                .set('Authorization', `Bearer ${this.token}`) // Authorization é a autentifcação (cadeado) de segurança. Passamos o 'Bearer e concatenano com o TOKEN'
                .send(postTranfer); // Passando apenas a Variávels que tem o Objeto de Tranferencia

            expect(resposta.status).to.equal(201);
            expect(respostaEsperada.transfer) // Pegando o Objeto tranfer que é o BODY da requisição. Passamos assim, porque ele é UM Objeto, caso não fosse, passariamos o BODY no lugar dele
                .excluding('date')
                .to.deep.equal(respostaEsperada.transfer)
        });


        const testesDeErroDeNegocio = require('../fixture/requisicoes/transferencias/postCreateTransferWithError.json')

        testesDeErroDeNegocio.forEach(teste => {
            it(`Testando a regra relacionada a ${teste.nomeDoTeste}`, async () => {

                const resposta = await request(process.env.BASE_URL_REST) // Passamos a URL da API ao invés do APP
                    .post('/transfer')
                    .set('Authorization', `Bearer ${this.token}`) // Authorization é a autentifcação (cadeado) de segurança. Passamos o 'Bearer e concatenano com o TOKEN'
                    .send(teste.postTransfer);

                expect(resposta.status).to.equal(400);
                expect(resposta.body).to.have.property('error', teste.mensagemEsperada)
            });
        })


        // it('Quando informo um destinatario inexistentes recebo 400', async () => {

        //     // 1) Capturar o Token
        //     const respostaLogin = await request(process.env.BASE_URL_REST)
        //         .post('/login')
        //         .send({
        //             username: 'jadson',
        //             password: '123456'
        //         })
        //     const token = respostaLogin.body.token // a respostaLogin.body.token, está pegando exatamente o token, e estamos passando ele para a variável TOKEN

        //     const resposta = await request(process.env.BASE_URL_REST) // Passamos a URL da API ao invés do APP
        //         .post('/transfer')
        //         .set('Authorization', `Bearer ${token}`) // Authorization é a autentifcação (cadeado) de segurança. Passamos o 'Bearer e concatenano com o TOKEN'
        //         .send({
        //             from: "jadson", // Remetente existe
        //             to: "isaque", // Destinatário não
        //             amount: 100
        //         });

        //     expect(resposta.status).to.equal(400);
        //     expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado')
        // });
        


        // it('Quando informo remetente inexistentes recebo 400', async () => {

        //     // 1) Capturar o Token
        //     const respostaLogin = await request(process.env.BASE_URL_REST)
        //         .post('/login')
        //         .send({
        //             username: 'jadson',
        //             password: '123456'
        //         })
        //     const token = respostaLogin.body.token // a respostaLogin.body.token, está pegando exatamente o token, e estamos passando ele para a variável TOKEN

        //     const resposta = await request(process.env.BASE_URL_REST) // Passamos a URL da API ao invés do APP
        //         .post('/transfer')
        //         .set('Authorization', `Bearer ${token}`) // Authorization é a autentifcação (cadeado) de segurança. Passamos o 'Bearer e concatenano com o TOKEN'
        //         .send({
        //             from: "isaque", //Remetente Não
        //             to: "jadson", // Destinatário existe
        //             amount: 100
        //         });

        //     expect(resposta.status).to.equal(400);
        //     expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado')
        // });

    });

});