const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const MAIN_ROUTE = '/v1/accounts';
let user;
let user2;
const mail = `${Date.now()}@ipca.pt`;
const secret = 'ipca!DWM@202122';

beforeEach(async () => {
  const res = await app.services.user.save({ name: 'Quimbe Alberto', email: `${Date.now()}@ipca.pt`, password: '1234' });
  user = { ...res[0] };
  user.token = jwt.encode(user, secret);
  const res2 = await app.services.user.save({ name: 'Arlindo Jose', email: `${Date.now()}@ipca.pt`, password: '12345' });
  user2 = { ...res2[0] };
});

test(' Test #7 - Inserir contas', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ name: 'Account #1' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Account #1');
    });
});

test('Test #8 - Listar contas', () => {
  return app.db('accounts')
    .insert({ name: 'Account list', user_id: user.id })
    .then(() => request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Test #9 - Listar conta por ID', () => {
  return app.db('accounts')
    .insert({ name: 'Account By id', user_id: user.id }, ['id'])
    .then((acc) => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Account By id');
      expect(res.body.user_id).toBe(user.id);
    });
});

test('Test #10 - Alterar conta ', () => {
  return app.db('accounts')
    .insert({ name: 'Account - Update', user_id: user.id }, ['id'])
    .then((acc) => request(app).put(`${MAIN_ROUTE}/${acc[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .send({ name: 'Account update' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Account update');
    });
});

test('Test #11 - Remover conta', () => {
  return app.db('accounts').insert({ name: 'Account - Remove', user_id: user.id }, ['id'])
    .then((acc) => request(app).delete(`${MAIN_ROUTE}/${acc[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .send({ name: 'Account update' }))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Test #12 - Inserir conta sem nome', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatorio');
    });
});

test('Test #18 - Listar apenas as contas do utilizador', () => {
  return app.db('accounts')
    .insert([
      { name: 'Account U #1', user_id: user.id },
      { name: 'Account U #2', user_id: user2.id },
    ]).then(() => request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Account U #1');
    });
});

test('Test #19 - Inserir nome de conta duplicado', () => {
  return app.db('accounts')
    .insert({ name: 'Account Dup', user_id: user.id })
    .then(() => request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${user.token}`)
      .send({ name: 'Account Dup' }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Já existe uma conta com o nome indicado');
    });
});

test('Test #20 - Aceder a conta do outro utilizador', () => {
  return app.db('accounts')
    .insert({ name: 'Account U#2', user_id: user2.id }, ['id'])
    .then((acc) => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Nao tem acesso ao recurso solicitado');
    });
});

test('Test #21 - Remover a conta de outro utilizador', () => {
  return app.db('accounts')
    .insert({ name: 'Account U#2', user_id: user2.id })
    .then(() => request(app).delete(MAIN_ROUTE)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Nao tem acesso ao recurso solicitado');
    });
});

//pdf 7.1 page 26 test 22
