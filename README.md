# API de Transferências e Usuários

Esta API permite o registro, login, consulta de usuários e transferências de valores entre usuários, com regras básicas de negócio. O objetivo é servir de base para estudos de testes e automação de APIs.

## Tecnologias
- Node.js
- Express
- Swagger (documentação)

## Instalação

1. Clone o repositório ou copie os arquivos para seu ambiente.
2. Instale as dependências:
   ```
npm install express swagger-ui-express
   ```

## Como rodar

- Para iniciar o servidor:
  ```
  node server.js
  ```
- O servidor rodará por padrão na porta 3000.

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
Acesse [http://localhost:3000/api-docs](http://localhost:3000/api-docs) após iniciar o servidor para visualizar e testar os endpoints. a