// Bibliotecas
const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config(); // Importando o dotENV


// Testes via HTTP
describe('Transfer', () => {
    describe('POST /transfer', () => {
        it('Quando informo remetente e destinatario existentes recebo 201', async () => {

            // 1) Capturar o Token
            const respostaLogin = await request(process.env.BASE_URL_REST) // Passando a URL fixa do .ENV
                .post('/login')
                .send({
                    username: 'jadson',
                    password: '123456'
                })
            const token = respostaLogin.body.token // a respostaLogin.body.token, está pegando exatamente o token, e estamos passando ele para a variável TOKEN

            const resposta = await request(process.env.BASE_URL_REST) // Passamos a URL da API ao invés do APP
                .post('/transfer')
                .set('Authorization', `Bearer ${token}`) // Authorization é a autentifcação (cadeado) de segurança. Passamos o 'Bearer e concatenano com o TOKEN'
                .send({
                    from: "jadson",
                    to: "yasmin",
                    amount: 100
                });

            expect(resposta.status).to.equal(201);
        });

        it('Quando informo um destinatario inexistentes recebo 400', async () => {

            // 1) Capturar o Token
            const respostaLogin = await request(process.env.BASE_URL_REST)
                .post('/login')
                .send({
                    username: 'jadson',
                    password: '123456'
                })
            const token = respostaLogin.body.token // a respostaLogin.body.token, está pegando exatamente o token, e estamos passando ele para a variável TOKEN

            const resposta = await request(process.env.BASE_URL_REST) // Passamos a URL da API ao invés do APP
                .post('/transfer')
                .set('Authorization', `Bearer ${token}`) // Authorization é a autentifcação (cadeado) de segurança. Passamos o 'Bearer e concatenano com o TOKEN'
                .send({
                    from: "jadson", // Remetente existe
                    to: "isaque", // Destinatário não
                    amount: 100
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado') 
        });

        
        it('Quando informo remetente inexistentes recebo 400', async () => {

            // 1) Capturar o Token
            const respostaLogin = await request(process.env.BASE_URL_REST)
                .post('/login')
                .send({
                    username: 'jadson',
                    password: '123456'
                })
            const token = respostaLogin.body.token // a respostaLogin.body.token, está pegando exatamente o token, e estamos passando ele para a variável TOKEN

            const resposta = await request(process.env.BASE_URL_REST) // Passamos a URL da API ao invés do APP
                .post('/transfer')
                .set('Authorization', `Bearer ${token}`) // Authorization é a autentifcação (cadeado) de segurança. Passamos o 'Bearer e concatenano com o TOKEN'
                .send({
                    from: "isaque", //Remetente Não
                    to: "jadson", // Destinatário existe
                    amount: 100
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado') 
        });

    });

});