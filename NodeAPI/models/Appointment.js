const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  vaccine: { type: mongoose.Schema.Types.ObjectId, ref: 'Vaccine', required: true },
  scheduledDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Pending Approval', 'Paid & Scheduled', 'Completed', 'Missed', 'Rejected'],
    default: 'Pending Approval'
  },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
