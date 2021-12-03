const { Sauveteur } = require('../models');
const { ObjectId } = require('mongosse').Types;

const router = require('express').Router();
router.get('/sauv/:id', (req, res) => {
  const { id } = req.query;
  if (!ObjectId.isValid(id)) {
    return format(res, 400, 'C pa un sovteur');
  }

  const sauveteur = Sauveteur.findById(id);
  if (!sauveteur) {
    return format(res, 404, "L'sovteur est pô lô");
  }

  format(res, 200, { sauveteur });
});

router.get('/', async (req, res) => {
  console.log(req.session);
  console.log(req.cookies);
  format(res, 200, { ok2: req.sauveteur });
});

module.exports = router;
