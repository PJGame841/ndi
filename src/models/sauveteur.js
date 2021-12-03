const mongoose = require('mongoose');

const sauveteurSchema = new mongoose.Schema({
  nom: {
    type: String,
    require: true,
    minlength: 1,
    maxlength: 32,
  },
  prenom: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 32,
  },
  dateN: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model('Sauveteur', sauveteurSchema);
