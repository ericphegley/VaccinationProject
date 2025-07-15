const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true},
  password: { type: String, required: true},
  age: Number,
  gender: String,
  profession: String,
  contact: String,
  address: String,
  disease: String,
  medicalCertificate: String, 
})

module.exports = mongoose.model('User', userSchema);