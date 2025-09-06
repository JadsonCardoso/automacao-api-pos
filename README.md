# API de Transferências e Usuários

Esta API permite o registro, login, consulta de usuários e transferências de valores entre usuários, com regras básicas de negócio. O objetivo é servir de base para estudos de testes e automação de APIs.

## Tecnologias
- Node.js
- Express
- Swagger (documentação)
- Apollo Server (GraphQL)

## Instalação

1. Clone o repositório ou copie os arquivos para seu ambiente.
npm install express swagger-ui-express
2. Instale as dependências:
   ```
   npm install express swagger-ui-express @apollo/server graphql graphql-tag cors body-parser jsonwebtoken
   ```


## Como rodar

- Para iniciar o servidor REST:
   ```
   node server.js
   ```
   O servidor rodará por padrão na porta 3000.

- Para iniciar o servidor GraphQL:
   ```
   node graphql/server.js
   ```
   O servidor GraphQL rodará por padrão na porta 4000.
## API GraphQL

### Endpoints

- `POST /graphql` — Endpoint principal para queries e mutations.

### Queries disponíveis
- `users`: Lista todos os usuários
- `transfers`: Lista todas as transferências (requer autenticação JWT)

### Mutations disponíveis
- `register(username, password, isFavored)`: Registra um novo usuário
- `login(username, password)`: Realiza login e retorna o token JWT
- `transfer(from, to, amount)`: Realiza transferência (requer autenticação JWT)

### Autenticação JWT
- Após o login, utilize o token JWT retornado para autenticar mutations de transferência e consulta de transferências.
- No Playground/Altair/Insomnia, envie o header:
   ```
   Authorization: Bearer <seu_token_jwt>
   ```

## Endpoints

- `POST /register` — Registra um novo usuário. Campos: `username` (string), `password` (string), `isFavored` (boolean, opcional).
- `POST /login` — Realiza login. Campos: `username` (string), `password` (string).
- `GET /users` — Lista todos os usuários cadastrados.
- `POST /transfer` — Realiza transferência. Campos: `from` (string), `to` (string), `amount` (number).
- `GET /transfers` — Lista todas as transferências realizadas.
- `GET /api-docs` — Documentação Swagger interativa.

## Regras de Negócio

1. Login exige usuário e senha.
2. Não é permitido registrar usuários duplicados.
3. Transferências para destinatários não favorecidos só são permitidas se o valor for menor que R$ 5.000,00.

## Testes

- O arquivo `app.js` exporta a aplicação Express sem o método `listen()`, facilitando testes com Supertest.

## Observações
- O banco de dados é em memória, os dados são perdidos ao reiniciar o servidor.
- O saldo inicial de cada usuário é de R$ 10.000,00.

## Documentação Swagger
Acesse [http://localhost:3000/api-docs](http://localhost:3000/api-docs) após iniciar o servidor para visualizar e testar os endpoints REST.