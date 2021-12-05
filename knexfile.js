module.exports = {
  test: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'Scubycao1310',
      database: 'pessoal',
    },
    debug: false,
    migrations: {
      directory: 'src/migrations',
    },
    pool: {
      min: 0,
      max: 50,
      propagateCreateError: false,
    },
  },
};
