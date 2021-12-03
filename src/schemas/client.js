const Joi = require('joi');
const { format, validateEmail } = require('../utils');

const clientLoginSchema = Joi.object({
  username: Joi.string().min(1).max(32).required(),
  password: Joi.string().required(),
});

const clientRegisterSchema = Joi.object({
  username: Joi.string().min(1).max(32).required(),
  nom: Joi.string().min(1).max(32).required(),
  prenom: Joi.string().min(1).max(32),
  password: Joi.string().required(),
  email: Joi.string()
    .required()
    .email({ tlds: { allow: false } }),
});

const checkLogin = async (req, res, next) => {
  try {
    await clientLoginSchema.validateAsync(req.body);
    next();
  } catch (e) {
    return format(res, 400, 'Erreur lors du login: ' + e);
  }
};

const checkRegister = async (req, res, next) => {
  try {
    await clientRegisterSchema.validateAsync(req.body);
    next();
  } catch (e) {
    return format(res, 400, 'Erreur lors du register: ' + e);
  }
};

module.exports = { checkLogin, checkRegister };
