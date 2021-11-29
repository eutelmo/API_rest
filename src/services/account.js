const validationError = require('../errors/validationError');

module.exports = (app) => {
  const save = async (account) => {
    if (!account.name) throw new validationError('Nome é um atributo obrigatorio');

    const accDB = await find({ name: account.name, user_id: account.user_id });
    if (accDB) throw new validationError('Já existe uma conta com o nome indicado');

    return app.db('accounts').insert(account, '*');
  };

  const findAll = (userId) => {
    return app.db('accounts').where({ user_id: userId });
  };

  const find = (filter = {}) => {
    return app.db('accounts').where(filter).first();
  };

  const update = (id, account) => {
    return app.db('accounts')
      .where({ id })
      .update(account, '*');
  };

  const remove = (id) => {
    return app.db('accounts')
      .where({ id })
      .del();
  };

  return {
    save, findAll, find, update, remove,
  };
};
