const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User'); 
const Hospital = require('../models/Hospital');
const Vaccine = require('../models/Vaccine');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

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
    if (status === 'Paid & Scheduled') {
      const doc = new PDFDocument();
      const filePath = path.join(__dirname, '..', 'pdfs', `${updated._id}.pdf`);
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      doc.fontSize(20).text('Vaccination Appointment Details', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12);
      doc.text(`Date: ${new Date(updated.scheduledDate).toLocaleString()}`);
      doc.text(`Status: ${updated.status}`);
      doc.text(`Hospital Name: ${updated.hospital.name}`);
      doc.text(`Hospital Address: ${updated.hospital.address}`);
      doc.text(`Hospital Type: ${updated.hospital.type}`);
      doc.text(`Charges: $${updated.hospital.charges}`);
      doc.text(`Vaccine Name: ${updated.vaccine.name}`);
      doc.text(`Vaccine Type: ${updated.vaccine.type}`);
      doc.text(`Doses Required: ${updated.vaccine.doses}`);
      doc.end();
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/pdf', async (req, res) => {
  const filePath = path.join(__dirname, '..', 'pdfs', `${req.params.id}.pdf`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'PDF not found. Please make payment first.' });
  }

  res.download(filePath, `appointment_${req.params.id}.pdf`);
});

router.get('/report/gender-distribution', async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: 'Paid & Scheduled' })
      .populate('user');

    const genderCount = {};

    appointments.forEach(app => {
      const gender = app.user?.gender || 'Unknown';
      genderCount[gender] = (genderCount[gender] || 0) + 1;
    });

    res.json(genderCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/report/age-distribution', async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: 'Paid & Scheduled' })
      .populate('user');

    const ageGroups = {
      '0-17': 0,
      '18-35': 0,
      '36-60': 0,
      '61+': 0
    };

    appointments.forEach(app => {
      const age = app.user?.age || 0;
      if(age <= 17){
        ageGroups['0-17']++;
      }else if(age <= 35){
        ageGroups['18-35']++;
      }else if(age <= 60){
        ageGroups['36-60']++;
      }else{
        ageGroups['61+']++;
      }
    });

    res.json(ageGroups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/report/vaccine-distribution', async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: 'Paid & Scheduled' })
    .populate('vaccine');

    const vaccineCount = {};
    appointments.forEach(app => {
      const name = app.vaccine?.name || 'Unknown';
      vaccineCount[name] = (vaccineCount[name] || 0) + 1;
    });

    res.json(vaccineCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/report/doses-per-day', async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: 'Paid & Scheduled' });

    const dailyCounts = {};

    appointments.forEach(app => {
      const date = new Date(app.scheduledDate)
        .toISOString()
        .split('T')[0];

      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    res.json(dailyCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/report/population-covered', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const vaccinatedUsers = await Appointment.distinct('user', {
      status: 'Paid & Scheduled'
    });

    const vaccinatedCount = vaccinatedUsers.length;
    const notVaccinatedCount = totalUsers - vaccinatedCount;

    res.json({
      'Vaccinated': vaccinatedCount,
      'Not Vaccinated': notVaccinatedCount
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/report/watchlist', async (req, res) => {
  try{
    const totalUsers = await User.countDocuments();

    const vaccinatedUsers = await Appointment.distinct('user', {
      status: 'Paid & Scheduled'
    });
    const users = await User.find({ _id: { $in: vaccinatedUsers }});
    const vaccinatedCount = users.length;
    let male = 0, female = 0;
    users.forEach(u => {
      console.log("name ", u.name)
      if (u.gender === 'Male') male++;
      else if (u.gender === 'Female') female++;
    })

    const genderData = {
      Male: ((male / vaccinatedCount) * 100).toFixed(0),
      Female: ((female / vaccinatedCount) * 100).toFixed(0)
    };

    let age017 = 0
    let age1835 = 0
    let age3660 = 0
    let age60up = 0
    console.log("Male", male)
    console.log(female)
    console.log(vaccinatedCount)
    users.forEach(u => {
      if(u.age < 18) age017++;
      else if(u.age <= 35)age1835++;
      else if(u.age <= 60)age3660++;
      else age60up++;
    })
    console.log("17",age017)
    console.log("35",age1835)
    console.log("60",age3660)
    console.log("up",age60up)
    const ageData = {
      '0-17': ((age017 / vaccinatedCount) * 100).toFixed(0),
      '18-35': ((age1835 / vaccinatedCount) * 100).toFixed(0),
      '36-60': ((age3660 / vaccinatedCount) * 100).toFixed(0),
      '60+': ((age60up / vaccinatedCount) * 100).toFixed(0)
    };
    const totalCoverage = ((vaccinatedCount / totalUsers)*100).toFixed(0);
    console.log(Number(totalCoverage))
    console.log(genderData)
    console.log(ageData)
    res.json({
      overallCoverage: Number(totalCoverage),
      gender: genderData,
      age: ageData
    });
  } catch (err){
    res.status(500).json({ error: err.message });
  }
})






module.exports = router;
