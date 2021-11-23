const bcrypt = require('bcrypt-nodejs');
const validationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('users').where(filter).select(['id', 'email', 'name']);
  };

  const findOne = (filter = {}) => {
    return app.db('users').where(filter).first();
  };

  const getPasswdHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const save = async (user) => {
    if (!user.name) throw new validationError('Nome é um atributo obrigatorio');
    if (!user.email) throw new validationError('O email é um atributo obrigatorio');
    if (!user.password) throw new validationError('A palavra-passe é um atributo obrigatorio');

    const userDb = await findOne({ email: user.email });
    if (userDb) throw new validationError('Email duplicado na BD');

    const newUser = { ...user };
    newUser.password = getPasswdHash(user.password);
    return app.db('users').insert(newUser, ['id', 'email', 'name']);
  };

  return { findAll, save, findOne };
};
