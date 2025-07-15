const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true},
  type: { type: String, required: true},
  charges: Number,
})

module.exports = mongoose.model('Hospital', hospitalSchema);