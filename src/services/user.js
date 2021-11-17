const validationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('users').where(filter).select();
  };

  const save = async (user) => {
    if (!user.name) throw new validationError('Nome é um atributo obrigatorio');
    if (!user.email) throw new validationError('O email é um atributo obrigatorio');
    if (!user.password) throw new validationError('A palavra-passe é um atributo obrigatorio');

    const userDb = await findAll({ email: user.email });
    if (userDb && userDb.length > 0) throw new validationError('Email duplicado na BD');
    return app.db('users').insert(user, '*');
  };

  return { findAll, save };
};
