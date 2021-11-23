const request = require('supertest');

const app = require('../../src/app');
const user = require('../../src/services/user');

const mail = `${Date.now()}@ipca.pt`;

test('test #1 - Listar os utilizadores', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Test #2 - Inserir utilizadores', () => {
  return request(app).post('/users')
    .send({ name: 'Quimbe Alberto', email: mail, password: '24357' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Quimbe Alberto');
      expect(res.body).not.toHaveProperty('password');
    });
});

test('Test #2.1 - Guardar a palavra-passe encriptada', async () =>{
  const res = await request(app).post('/users')
    .send({ name: 'Quimbe Alberto', email: `${Date.now()}@ipca.pt`, password: '1234' });
  expect(res.status).toBe(201);

  const { id } = res.body;
  const userBD = await app.services.user.findOne({ id });
  expect(userBD.password).not.toBeUndefined();
  expect(userBD.password).not.toBe('12345');
});

test(' Test #3 - Inerir utilizador sem nome', () => {
  return request(app).post('/users')
    .send({ email: mail, password: '12345' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatorio');
    });
});
test('Test #4 - Inserir utilizador sem email', async () => {
  const result = await request(app).post('/users')
    .send({ name: 'Quimbe Alberto', password: '24357' });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('O email é um atributo obrigatorio');
});

test('Test #5 - Inserir utilizador sem password', (done) => {
  request(app).post('/users')
    .send({ name: 'Quimbe Alberto', email: mail })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('A palavra-passe é um atributo obrigatorio');
      done();
    });
});
test('Test #6 - Email Duplicado', () => {
  return request(app).post('/users')
    .send({ name: 'Quimbe Alberto', email: mail, password: '12345' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email duplicado na BD');
    });
});
