// Bibliotecas
const request = require('supertest');
const { expect } = require('chai');


// Testes via HTTP
describe('Transfer', () => {
    describe('POST /transfer', () => {
         it('Quando informo remetente e destinatario inexistentes recebo 400', async () => {
            const resposta = await request('http://localhost:3000') // Passamos a URL da API ao invés do APP
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

});