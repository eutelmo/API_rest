const supertest = require('supertest');

const request = supertest('http://localhost:3001');

test.skip('validar se o servidor responde no porto 3001', () => {
  return request.get('/')
    .then((res) => expect(res.status).toBe(200));
});
