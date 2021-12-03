const mongoose = require('mongoose');

const canotSchema = new mongoose.Schema({
  listS: [{ type: mongoose.Types.ObjectId, ref: 'Sauveteur' }],
});

module.exports = mongoose.model('Canot', canotSchema);
