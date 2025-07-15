const mongoose = require('mongoose');

const vaccineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true},
  price: Number,
  sideEffect: { type: String, required: true},
  origin: { type: String, required: true},
  doses: { type: String, required: true},
  strainCoverage: { type: String, required: true},
})

module.exports = mongoose.model('Vaccine', vaccineSchema);