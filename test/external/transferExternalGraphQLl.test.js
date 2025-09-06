const request = require('supertest'); // Importando a Biblioteca para fazer requisiçoes
const { expect } = require('chai'); // Importando a Biblioteca de asserções
const { query } = require('express');

describe('Teste de Transferência', () => {
    it.only('Validar que é possível transferir grana entre duas contas', async () => {
        // Escrever o teste: Enviando requisição, para pegar o token
        const resposta = await request('http://localhost:4000/graphql') // Passando a URL do servidor
            .post('')
            .send({ // Passamos os valores dentro da CRASE para podermos pulas as linhas
                query: `
                    mutation Login($username: String!, $password: String!) {
                        login(username: $username, password: $password) {
                            token
                        }
                    }
               `,
                variables: {
                    username: 'jadson',
                    password: '123456'
                }
            });

        const respostaTransferencia = await request('http://localhost:4000/graphql')
            // Escrever o teste: Enviando requisição, para tranferencia 
            .post('')
            .set('Authorization', `Bearer ${resposta.body.data.login.token}`) //Passando o token na Authorization
            .send({ // Passamos os valores dentro da CRASE para podermos pulas as linhas
                query: `
                    mutation Transfer($from: String!, $to: String!, $amount: Float!) {
                        transfer(from: $from, to: $to, amount: $amount) {
                            from
                            to
                            amount
                            date
                        }
                    }   
                `,
                variables: {
                    from: 'jadson',
                    to: 'yasmin',
                    amount: '123456'    
                }
            });

        expect(respostaTransferencia.status).to.equal(200); // Validando o status code
    });
})