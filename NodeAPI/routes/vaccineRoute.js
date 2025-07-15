const express = require('express');
const router = express.Router();
const Vaccine = require('../models/Vaccine');

//addVaccine
router.post('/addVaccine', async (req, res) => {
  try {
    const existingVaccine = await Vaccine.findOne({ 
      name: req.body.name,
      address: req.body.address
    });
    if (existingVaccine) {
      return res.status(409).json({ error: 'Vaccinename already exists' });
    }

    const newVaccine = await Vaccine.create(req.body);
    return res.status(201).json({ message: 'Vaccine added', vaccine: newVaccine });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//List all users
router.get('/getVaccines', async (req, res) => {
  const vaccines = await Vaccine.find();
  res.json(vaccines);
});


//Delete user by Id
router.delete('/deleteVaccine/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVaccine = await Vaccine.findByIdAndDelete(id);

    if (!deletedVaccine) {
      return res.status(404).json({ error: 'Vaccine not found' });
    }

    res.status(200).json({ message: 'Vaccine deleted successfully', vaccine: deletedVaccine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//update vaccine
router.put('/updateVaccine/:id', async(req, res) => {
  try{
    const updatedVaccine = await Vaccine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if(!updatedVaccine) return res.status(404).json({ error: 'Not found'});
    res.status(200).json({ message: 'Vaccine updated', vaccine: updatedVaccine })
  }
  catch(err){
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
