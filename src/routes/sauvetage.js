const { Sauvetage } = require('../models');
const { ObjectId } = require('mongoose').Types;

const router = require('express').Router();

router.get('/get/:id', async (req, res) => {
  const { id } = req.query;
  if (!ObjectId.isValid(id)) {
    return format(res, 400, "M'sieur MACRON l'sauvtage");
  }

  const sauvetage = Sauvetage.findById(id);
  if (!sauvetage) {
    return format(res, 404, "L'sauvtage é caché");
  }

  format(res, 200, { sauvetage });
});

router.get('/', async (req, res) => {
  console.log(req.session);
  format(res, 200, { ok2: req.sauvetage });
});

module.exports = router;
