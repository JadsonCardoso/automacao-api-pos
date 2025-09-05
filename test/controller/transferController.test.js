// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

// Aplicacao
const app = require('../../app');
const { equal } = require('assert');

// Mock
const transferService = require('../../service/transferService'); // Importar o TransferService
const { afterEach } = require('mocha');

// Testes
describe('Transfer Controller', () => {
    describe('POST /transfer', () => {

         let token = null; // Passe o token Como LET fora do BEFOREBEACH

        beforeEach(async () => { // Esse before será rodado uma vez antes de cada IT
            // 1) Capturar o Token
            const respostaLogin = await request(app) // Passsando o APP
                .post('/login')
                .send({
                    username: 'jadson',
                    password: '123456'
                })

             this.token = respostaLogin.body.token // a respostaLogin.body.token, está pegando exatamente o token, e estamos passando ele para a variável TOKEN
        })


        it('Quando informo remetente e destinatario inexistentes recebo 400', async () => {


            const resposta = await request(app)
                .post('/transfer')
                .set('Authorization', `Bearer ${this.token}`) // Authorization é a autentifcação (cadeado) de segurança. Passamos o 'Bearer e concatenano com o TOKEN'
                .send({
                    from: "jadson",
                    to: "joao",
                    amount: 100
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado')
        });

        it('Usando Mocks: Quando informo remetente e destinatario inexistentes recebo 400', async () => {
            // MOCK
            const transferServiceMock = sinon.stub(transferService, 'transfer')
            transferServiceMock.throws(new Error('Usuário remetente ou destinatário não encontrado'))

            const resposta = await request(app)
                .post('/transfer')
                .set('Authorization', `Bearer ${this.token}`) // Authorization é a autentifcação (cadeado) de segurança. Passamos o 'Bearer e concatenano com o TOKEN'
                .send({
                    from: "joao",
                    to: "yasmin",
                    amount: 100
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado') // p 'property' Verificando na propriedade  tem o valor: Nesse exemplo e na propriedade 'error'

        });

        it('Usando Mocks: Quando informo valores válidos recebo 201', async () => {
            const transferServiceMock = sinon.stub(transferService, 'transfer')
            transferServiceMock.returns({ // A função 'returns' é para quanso a função que estamos mockando retorna alguma coisa
                from: "jadson",  // Passamos os valores conforme a sua propriedade
                to: "yasmin",
                amount: 100,
                date: new Date()
            })

            const resposta = await request(app)
                .post('/transfer')
                .set('Authorization', `Bearer ${this.token}`) // Authorization é a autentifcação (cadeado) de segurança. Passamos o 'Bearer e concatenano com o TOKEN'
                .send({
                    from: "jadson",
                    to: "yasmin",
                    amount: 100
                });

            expect(resposta.status).to.equal(201);

            // Um expect para comparar a Respsota.body com a string contida no Arquivo
            const respostaEsperada = require('../fixture/respostas/quandoInformoValoresValidadosEuTenhoSucessoCom201Created.json')
            delete resposta.body.date; // Removendo a propriedade 'date' do corpo
            // resposta.body.to = "outro user"; // Alteração do valor da propriedade do BODY
            delete respostaEsperada.date; // Removendo a propriedade 'date' do arquivo fixure, por o ARQUIVO será comparado com o BODY
            // respostaEsperada.to = "outro user"; // Alteração do valor da propriedade NA FIXTURE
            expect(resposta.body).to.eql(respostaEsperada); // Comparamdo as dados do RESPOSTA.BODY para com RESPOSTAESPERADA a qual recebe o ARQUIVO FIXTURE

            console.log(resposta.body);
            console.log(respostaEsperada);
        });

        
        afterEach(() => {
            // Reseto o Mock: Mata o mock e volta ao normal.
            sinon.restore();
        })

    });

    describe('GET /transfer', () => {

    });
});