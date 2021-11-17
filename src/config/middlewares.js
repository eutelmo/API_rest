const bodyParser1 = require('body-parser');

module.exports = (app) => {
  app.use(bodyParser1.json());
};
