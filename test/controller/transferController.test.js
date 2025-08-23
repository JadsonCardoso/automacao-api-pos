// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

// Aplicacao
const app = require('../../app');
const { equal } = require('assert');

// Mock
const transferService = require('../../service/transferService') // Importar o TransferService

// Testes
describe('Transfer Controller', () => {
    describe('POST /transfer', () => {
        it('Quando informo remetente e destinatario inexistentes recebo 400', async () => {
            const resposta = await request(app)
                .post('/transfer')
                .send({
                    from: "jadson",
                    to: "yasmin",
                    amount: 100
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado')
        });

        it('Usando Mocks: Quando informo remetente e destinatario inexistentes recebo 400', async () => {
            const transferServiceMock = sinon.stub(transferService, 'transfer')
            transferServiceMock.throws(new Error('Usuário remetente ou destinatário não encontrado'))

            const resposta = await request(app)
                .post('/transfer')
                .send({
                    from: "jadson",
                    to: "yasmin",
                    amount: 100
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado') // p 'property' Verificando na propriedade  tem o valor: Nesse exemplo e na propriedade 'error'

            // Reseto o Mock: Mata o mock e volta ao normal.
            sinon.restore()

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
                .send({
                    from: "jadson",
                    to: "yasmin",
                    amount: 100
                });

            expect(resposta.status).to.equal(201);
            expect(resposta.body).to.have.property('from', 'jadson');
            expect(resposta.body).to.have.property('to', 'yasmin');
            expect(resposta.body).to.have.property('amount', 100);

            // Reseto o Mock: Mata o mock e volta ao normal.
            sinon.restore();

        });

    });

    describe('GET /transfer', () => {

    });
});