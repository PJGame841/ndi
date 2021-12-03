const mongoose = require('mongoose');
const { validateEmail } = require('../utils');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const clientSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 32,
  },
  password: String,
  role: {
    type: String,
    default: 'user',
    minlength: 1,
    maxlength: 32,
  },
  nom: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 32,
  },
  prenom: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 32,
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 32,
  },
  googleId: String,
  facebookId: String,
  githubId: String,
  token: String,
});
clientSchema.methods.checkPassword = function (password) {
  console.log(password, this.password);
  return bcrypt.compare(password, this.password);
};
clientSchema.methods.generateAuthToken = function (password) {
  const token = (Math.random() + 1).toString(36).substring(0);
  this.token = token;
  this.save();

  return token;
};
clientSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, process.env.LOGIN_SALT);
};

clientSchema
  .path('email')
  .validate(validateEmail, 'The e-mail field cannot be empty.');

module.exports = mongoose.model('Client', clientSchema);
