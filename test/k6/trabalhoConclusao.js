import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { BASE_URL } from './helpers/baseURL.js';
import { loginHelpers } from './helpers/loginHelpers.js'
import faker from "k6/x/faker";
import { SharedArray } from 'k6/data';

import { Trend } from 'k6/metrics';
const postRegistroDurationsTrend = new Trend('post_registro_durations');
const transfers = new SharedArray('transfers', function () {
    return JSON.parse(open('./data/transfer.data.json'));
})

export const options = {
    thresholds: {
        http_req_duration: ['p(90)<=3500', 'p(95)<=4300'],
        http_req_failed: ['rate<0.01']
    },
    stages: [
        { duration: '3s', target: 10 },
        { duration: '15s', target: 20 },
        { duration: '2s', target: 110 },
        { duration: '3s', target: 110 },
        { duration: '5s', target: 15 },
        { duration: '5s', target: 0 },
    ],
};

export default function () {
    const transfer = transfers[(__VU - 1) % transfers.length];

    const from = transfer.from;
    const to = transfer.to;
    const amount = transfer.amount;

    const name = `${faker.person.firstName()}_${__VU}_${__ITER}`;
    const userPassword = faker.internet.password();


    let loginRes = '';
    group('Registro de usuário', () => {
        let responsoRegistro = http.post(`${BASE_URL}/register`,
            JSON.stringify({
                username: name,
                password: userPassword,
                isFavored: true
            }),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        check(responsoRegistro, {
            'Registro deve retornar 201': (r) => r.status === 201
        })

        postRegistroDurationsTrend.add(responsoRegistro.timings.duration)
    });

    group('Login de Usuários', function () {
        loginRes = loginHelpers();

        check(loginRes, {
            'login retornou 200': (r) => r.status === 200,
            'Message deve retornar sucesso': (r) => r.json('message') === "Login realizado com sucesso",
        });

    });

    group('Transferências', () => {
        const token = loginRes.json().token;
        let responseTransfer = http.post(`${BASE_URL}/transfer`,
            JSON.stringify({
                from, to, amount
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        check(responseTransfer, {
            'Transferência retornou 201': (responseTransfer) => responseTransfer.status === 201
        });
    });

    group('Simulando ações do usuário', () => {
        sleep(1);
    });

}
