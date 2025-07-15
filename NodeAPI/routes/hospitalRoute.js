const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');

//addHospital
router.post('/addHospital', async (req, res) => {
  try {
    const existingHospital = await Hospital.findOne({ 
      name: req.body.name,
      address: req.body.address
    });
    if (existingHospital) {
      return res.status(409).json({ error: 'Hospitalname already exists' });
    }

    const newHospital = await Hospital.create(req.body);
    return res.status(201).json({ message: 'Hospital added', hospital: newHospital });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//List all users
router.get('/getHospitals', async (req, res) => {
  const hospitals = await Hospital.find();
  res.json(hospitals);
});


//Delete user by Id
router.delete('/deleteHospital/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedHospital = await Hospital.findByIdAndDelete(id);

    if (!deletedHospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.status(200).json({ message: 'Hospital deleted successfully', hospital: deletedHospital });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//update hospital
router.put('/updateHospital/:id', async(req, res) => {
  try{
    const updatedHospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if(!updatedHospital) return res.status(404).json({ error: 'Not found'});
    res.status(200).json({ message: 'Hospital updated', hospital: updatedHospital })
  }
  catch(err){
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
