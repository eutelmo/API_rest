const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.param('id', (req, res, next) => {
    app.services.account.find({ id: req.params.id })
      .then((account) => {
        if (account.user_id !== req.user.id) throw new ForbiddenError();
        else next();
      });
  });

  router.post('/', (req, res, next) => {
    app.services.account.save({ ...req.body, user_id: req.user.id })
      .then((result) => {
        return res.status(201).json(result[0]);
      }).catch((err) => {
        next(err);
      });
  });

  router.get('/', (req, res, next) => {
    app.services.account.findAll(req.user.id)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.get('/:id', (req, res, next) => {
    app.services.account.find({ id: req.params.id })
      .then((result) => {
        if (result.user_id !== req.user.id) return res.status(403).json({ error: 'Nao tem acesso ao recurso solicitado' });
        return res.status(200).json(result);
      })
      .catch((err) => next(err));
  });

  router.put('/:id', (req, res, next) => {
    app.services.account.update(req.params.id, req.body)
      .then((result) => res.status(200).json(result[0]))
      .catch((err) => next(err));
  });

  router.delete('/:id', (req, res, next) => {
    app.services.account.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  return router;
};

/*
module.exports = (app) => {
  const create = (req, res, next) => {
    app.services.account.save(req.body)
      .then((result) => {
        return res.status(201).json(result[0]);
      }).catch((err) => {
        next(err);
      });
  };
  const getAll = (req, res, next) => {
    app.services.account.findAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const get = (req, res) => {
    app.services.account.find({ id: req.params.id })
      .then((result) => res.status(200).json(result));
  };

  const update = (req, res) => {
    app.services.account.update(req.params.id, req.body)
      .then((result) => res.status(200).json(result[0]));
  };

  const remove = (req, res) => {
    app.services.account.remove(req.params.id)
      .then(() => res.status(204).send());
  };

  return {
    create, getAll, get, update, remove,
  };
};
*/
