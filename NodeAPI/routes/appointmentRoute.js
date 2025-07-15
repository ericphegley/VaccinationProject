const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User'); 
const Hospital = require('../models/Hospital');
const Vaccine = require('../models/Vaccine');

router.post('/addAppointment', async (req, res) => {
  try {
    const { user, hospital, vaccine, scheduledDate } = req.body;

    const [foundUser, foundHospital, foundVaccine] = await Promise.all([
      User.findById(user),
      Hospital.findById(hospital),
      Vaccine.findById(vaccine)
    ]);

    if (!foundUser || !foundHospital || !foundVaccine) {
      return res.status(404).json({ error: 'Invalid user, hospital, or vaccine ID' });
    }

    const appointment = new Appointment({
      user,
      hospital,
      vaccine,
      scheduledDate,
    });

    const saved = await appointment.save();
    res.status(201).json({ message: 'Appointment created', appointment: saved });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/user/:userId', async (req, res) => {
  console.log('Fetching appointments for user:', req.params.userId);
  try {
    const appointments = await Appointment.find({ user: req.params.userId })
      .populate('hospital')
      .populate('vaccine');

    if (!appointments || appointments.length === 0) {
      return res.status(200).json([]); 
    }

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/scheduled', async (req, res) => {
  console.log("Fetching scheduled appointments")
  try {
    const appointments = await Appointment.find({ status: 'Pending Approval' })
      .populate('user')
      .populate('hospital')
      .populate('vaccine');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/status', async (req, res) => {
  const { status } = req.body;

  if (!['Approved', 'Rejected', 'Paid & Scheduled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('user')
      .populate('hospital')
      .populate('vaccine');

    if (!updated) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;
