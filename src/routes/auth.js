const { format } = require('../utils');
const passport = require('passport');
const { client } = require('../schemas');
const { Client } = require('../models');
const router = require('express').Router();

// router.post('/login', (req, res, next) => {
//   passport.authenticate(
//     'zyzz-connection',
//     { session: true },
//     (err, user, info) => {
//       if (err) return format(res, 400, err);
//       if (!user) return res.redirect('/login');
//       req.logIn(user, function (err) {
//         if (err) return format(res, 400, err);
//         return format(res, 200, { ok: true });
//       });
//     }
//   )(req, res, next);
// });
router.post(
  '/login',
  passport.authenticate('zyzz-connection', { session: true }),
  async (req, res) => {
    if (!req.user) return format(res, 400, 'Not zyzz');
    format(res, 200, { token: req.user.generateAuthToken() });
  }
);

router.post('/register', [client.checkRegister], async (req, res) => {
  req.body.password = await Client.hashPassword(req.body.password);

  const exists = await Client.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });
  if (exists) {
    return format(
      res,
      400,
      'Il existe déjà un utilisateur avec ces informations'
    );
  }

  const client = new Client(req.body); // we can do that because the body is already validated !
  if (!client) {
    return format(res, 400, "Erreur lors de l'enregistrement !");
  }
  await client.save();

  res.redirect('/auth/login');
});

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/google/failure',
  }),
  (req, res) => {
    if (!req.user) return format(res, 400, 'Not zyzz');
    res.redirect(
      process.env.FRONT_URL + '/login?token=' + req.user.generateAuthToken()
    );
  }
);
router.get('/google/failure', async (req, res) => {
  format(res, 400, 'NOT ZYZZZ');
});

router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/auth/facebook/failure',
  }),
  async (req, res) => {
    if (!req.user) return format(res, 400, 'Not zyzz');
    res.redirect(
      process.env.FRONT_URL + '/login?token=' + req.user.generateAuthToken()
    );
  }
);
router.get('/facebook/failure', async (req, res) => {
  format(res, 400, 'NOT ZYZZZ on facebook');
});

router.get('/github', passport.authenticate('github', { scope: 'user:email' }));
router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/auth/github/failure',
  }),
  async (req, res) => {
    if (!req.user) return format(res, 400, 'Not zyzz');
    res.redirect(
      process.env.FRONT_URL + '/login?token=' + req.user.generateAuthToken()
    );
  }
);
router.get('/github/failure', async (req, res) => {
  format(res, 200, 'NOT ZYZZZ on github');
});

module.exports = router;
