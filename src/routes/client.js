const passport = require('passport');
const { format } = require('../utils');
const { logged } = require('../middlewares');
const { Client } = require('../models');
const { ObjectId } = require('mongoose').Types;

const router = require('express').Router();

router.get('/get/:id', [logged], async (req, res) => {
  const { id } = req.query;
  if (!ObjectId.isValid(id)) {
    return format(res, 400, "L'utilisateur n'exite pas !");
  }

  const user = Client.findById(id);
  if (!user) {
    return format(res, 404, "L'utilisateur n'a pas été trouvé !");
  }

  format(res, 200, { user });
});

router.get('/', logged, async (req, res) => {
  console.log(req.user);
  console.log(req.cookies);
  format(res, 200, { ok2: req.user });
});

module.exports = router;
