const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const PORT = 8082;

app.use(cors());
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1/VACC")
app.get('/', (req, res) => {
  res.send('Hello from Node API');
});


const userRoute = require('./routes/userRoute');
app.use('/api/users', userRoute)

const hospitalRoute = require('./routes/hospitalRoute')
app.use('/api/hospitals', hospitalRoute)

const vaccineRoute = require('./routes/vaccineRoute')
app.use('/api/vaccines', vaccineRoute)

const appointmentRoute = require('./routes/appointmentRoute')
app.use('/api/appointments', appointmentRoute)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
