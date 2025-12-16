# README - Testes k6 (pasta test/k6)

Este README explica, em linguagem simples e direta, onde cada conceito usado nos testes k6 aparece no código e mostra um pequeno exemplo real para cada um.

Para cada conceito eu informo:
- Em qual arquivo e caminho ele aparece
- Qual parte específica do código utiliza o conceito
- O que exatamente essa parte do código faz

---

Thresholds
- Arquivo: `test/k6/trabalhoConclusao.js`
- Trecho: o objeto `options` com a chave `thresholds`.
- Explicação:
  "No arquivo `test/k6/trabalhoConclusao.js`, o código que define `export const options` inclui `thresholds`, que diz ao k6 quais limites de desempenho esperar (por exemplo, 90% das requisições devem ficar abaixo de X ms). Isso demonstra o conceito 'Thresholds'.

Exemplo de código (Thresholds):
```javascript
export const options = {
  thresholds: {
    http_req_duration: ['p(90)<=3500', 'p(95)<=4300'],
    http_req_failed: ['rate<0.01']
  },
  stages: [ /* ... */ ],
};
```

Checks
- Arquivo: `test/k6/trabalhoConclusao.js`
- Trecho: chamadas a `check(...)` logo após requisições.
- Explicação:
  "No arquivo `test/k6/trabalhoConclusao.js`, o código usa `check(responsoRegistro, { 'Registro deve retornar 201': (r) => r.status === 201 })`. Isso demonstra o conceito 'Checks'.

Exemplo de código (Check):
```javascript
let responsoRegistro = http.post(`${BASE_URL}/register`, ...);
check(responsoRegistro, {
  'Registro deve retornar 201': (r) => r.status === 201
});
```
Helpers
- Arquivo: `test/k6/helpers/baseURL.js` e `test/k6/helpers/loginHelpers.js`
- Trecho: export de `BASE_URL` e função `loginHelpers()`.
- Explicação:
  "No arquivo `test/k6/helpers/baseURL.js`, a linha que exporta `BASE_URL` usa `__ENV` para escolher o servidor; em `test/k6/helpers/loginHelpers.js`, a função `loginHelpers()` faz o POST em `/login` e retorna a resposta. Isso demonstra 'Helpers'.

Exemplo de código (Helpers):
```javascript
// test/k6/helpers/baseURL.js
export const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

// test/k6/helpers/loginHelpers.js
import http from 'k6/http';
import { BASE_URL } from './baseURL.js';
import { SharedArray } from 'k6/data';

const users = new SharedArray('users', () => JSON.parse(open('../data/login.data.json')));

export function loginHelpers() {
  const user = users[(__VU - 1) % users.length];
  return http.post(`${BASE_URL}/login`, JSON.stringify({ username: user.username, password: user.password }), { headers: { 'Content-Type': 'application/json' } });
}
```
Trend
- Arquivo: `test/k6/trabalhoConclusao.js`
- Trecho: `import { Trend } from 'k6/metrics';`, criação `new Trend('post_registro_durations')` e `postRegistroDurationsTrend.add(...)`.
- Explicação:
  "No arquivo `test/k6/trabalhoConclusao.js`, o código cria um `Trend` e adiciona a duração do registro com `postRegistroDurationsTrend.add(responsoRegistro.timings.duration)`. Isso demonstra o conceito 'Trend'.

Exemplo de código (Trend):
```javascript
import { Trend } from 'k6/metrics';
const postRegistroDurationsTrend = new Trend('post_registro_durations');

// dentro do fluxo de registro
postRegistroDurationsTrend.add(responsoRegistro.timings.duration);
```
Faker
- Arquivo: `test/k6/trabalhoConclusao.js`
- Trecho: `import faker from 'k6/x/faker'` e uso de `faker.person.firstName()` e `faker.internet.password()`.
- Explicação:
  "No arquivo `test/k6/trabalhoConclusao.js`, o código usa `faker` para gerar nomes e senhas aleatórias ao criar usuários. Isso demonstra 'Faker'.
Exemplo de código (Faker):
```javascript
import faker from 'k6/x/faker';
const name = `${faker.person.firstName()}_${__VU}_${__ITER}`;
const userPassword = faker.internet.password();
```
Variáveis de ambiente
- Arquivo: `test/k6/helpers/baseURL.js`
- Trecho: `__ENV.BASE_URL || 'http://localhost:3001'`.
- Explicação:
  "No arquivo `test/k6/helpers/baseURL.js`, o código usa `__ENV.BASE_URL` para escolher a URL da API. Isso demonstra 'Variáveis de ambiente'.

Exemplo de código (Variáveis de ambiente):
```javascript
// test/k6/helpers/baseURL.js
export const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';
```
Stages
- Arquivo: `test/k6/trabalhoConclusao.js`
- Trecho: array `stages` dentro de `options`.
- Explicação:
  "No arquivo `test/k6/trabalhoConclusao.js`, o bloco `stages` diz como aumentar e diminuir o número de usuários no tempo (ex.: subir para 110 VUs, manter, e depois descer). Isso demonstra 'Stages'.

Exemplo de código (Stages):
```javascript
export const options = {
  stages: [
    { duration: '3s', target: 10 },
    { duration: '15s', target: 20 },
    { duration: '2s', target: 110 },
    { duration: '3s', target: 110 },
    { duration: '5s', target: 15 },
    { duration: '5s', target: 0 },
  ],
};
```
Reaproveitamento de resposta
- Arquivo: `test/k6/trabalhoConclusao.js`
- Trecho: armazenar `loginRes = loginHelpers()` e usar `loginRes.json().token` depois.
- Explicação:
  "No arquivo `test/k6/trabalhoConclusao.js`, o resultado do login é guardado em `loginRes` e depois usado para pegar o `token`. Isso demonstra 'Reaproveitamento de resposta'.

Exemplo de código (Reaproveitamento de resposta):
```javascript
// chama helper de login e guarda a resposta
let loginRes = loginHelpers();
// pega token da resposta e usa depois
const token = loginRes.json().token;
```
Uso de token de autenticação
- Arquivo: `test/k6/trabalhoConclusao.js`
- Trecho: header `Authorization: Bearer ${token}` na chamada de transferência.
- Explicação:
  "No arquivo `test/k6/trabalhoConclusao.js`, o código adiciona `Authorization: Bearer ${token}` aos headers da requisição de transferência. Isso demonstra 'Uso de token de autenticação'.
  
Exemplo de código (Uso de token):
```javascript
let responseTransfer = http.post(`${BASE_URL}/transfer`, JSON.stringify({ from, to, amount }), {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});
```
Data-Driven Testing
- Arquivo: `test/k6/helpers/loginHelpers.js` e `test/k6/data/login.data.json` (ou `test/k6/trabalhoConclusao.js` com `data/transfer.data.json`).
- Trecho: `SharedArray('users', () => JSON.parse(open('../data/login.data.json')))` ou `SharedArray('transfers', ...)`.
- Explicação:
  "No arquivo `test/k6/helpers/loginHelpers.js`, o código carrega `login.data.json` com `SharedArray` e compartilha entre VUs. Isso demonstra 'Data-Driven Testing'.

Exemplo de código (Data-Driven Testing):
```javascript
import { SharedArray } from 'k6/data';
const users = new SharedArray('users', () => JSON.parse(open('../data/login.data.json')));
const transfers = new SharedArray('transfers', () => JSON.parse(open('../data/transfer.data.json')));

const user = users[(__VU - 1) % users.length];
const transfer = transfers[(__VU - 1) % transfers.length];
```
Groups
- Arquivo: `test/k6/trabalhoConclusao.js`
- Trecho: `group('Registro de usuário', () => { ... })`, `group('Login de Usuários', () => { ... })`, `group('Transferências', () => { ... })`.
- Explicação:
  "No arquivo `test/k6/trabalhoConclusao.js`, o script está dividido em `group()` para registro, login e transferência. Isso demonstra 'Groups'.

Exemplo de código (Groups):
```javascript
group('Registro de usuário', () => {
  // registro
});

group('Login de Usuários', () => {
  // login
});

group('Transferências', () => {
  // transferência
});
