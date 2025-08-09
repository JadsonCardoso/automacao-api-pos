// Bibliotecas
const request = require('supertest');
const sino = require('sinon');
const { expect } = require('chai');

// Aplicacao
const app = require('../../app');
const { equal } = require('assert');

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

    });

    describe('GET /transfer', () => {

    });
});