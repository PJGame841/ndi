const mongoose = require('mongoose');

const sauvetageSchema = new mongoose.Schema({
  nomS: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 32,
  },
  dateS: {
    type: Date,
    required: true,
  },
  nbS: Number,
  dureeS: Number,
});

module.exports = mongoose.model('Sauvetage', sauvetageSchema);
