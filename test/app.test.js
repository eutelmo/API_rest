const request = require('supertest');

const app = require('../src/app');

test('Testar se esta a resolver na raiz', () => {
  return request(app).get('/')
    .then((res) => {
      expect(res.status).toBe(200);
    });
});
