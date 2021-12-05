const request = require('supertest');
const app = require('../../src/app');
const mail = `${Date.now()}@ipca.pt`;

test('Test #13 - Receber token ao autenticar', () => {
  return app.services.user.save(
    { name: 'Quimbe Auth', email: mail, password: '1234' }
  ).then(() => request(app).post('/auth/signin')
    .send({ email: mail, password: '1234' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
});

test('Test #14 - Tentativa de autenticação errada', () => {
  const nmail = `${Date.now()}@ipca.pt`;
  return app.services.user.save(
    { name: 'Quimbe Auth', email: nmail, password: '12345' }
  ).then(() => request(app).post('/auth/signin')
    .send({ email: mail, password: '67890' }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Autenticacao invalida!');
    });
});

test('Test #15 - Tentativa de autenticacao com utilizador errado', () => {
  const nmail = `${Date.now()}@ipca.pt`;
  return request(app).post('/auth/signin')
    .send({ email: nmail, password: '87890' }).then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Autenticacao invalida! #2');
    });
});

test('Test #16 - Aceder a rotas protegidas', () => {
  return request(app).get('/v1/users')
    .then((res) => {
      expect(res.status).toBe(401);
    });
});

test(' Test #17 - Criar utilizador', () => {
  const nmail = `${Date.now()}@ipca.pt`;
  return request(app).post('/auth/signup')
    .send({ name: 'Quimbe Signup', email: nmail, password: '12345' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Quimbe Signup');
      expect(res.body).toHaveProperty('email');
      expect(res.body).not.toHaveProperty('password');
    });
});
