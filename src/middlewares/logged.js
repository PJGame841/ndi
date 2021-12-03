const { verify } = require('jsonwebtoken');
const { format } = require('../utils');
const { Client } = require('../models');

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  const msg = "Vous n'êtes pas connecté";
  if (!authorization) {
    return format(res, 401, msg);
  }

  const token = authorization.substring(7);
  console.log(token);

  const user = await Client.findOne({ token });
  if (!user) return format(res, 404, msg);
  req.user = user;

  next();
};
