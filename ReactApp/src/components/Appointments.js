import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addAppointment, selectAppointment } from '../state/appointment/appointmentSlice';
import { useNavigate } from 'react-router-dom';
import "../styles/appointments.css";

const Appointments = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const hospitals = useSelector((state) => state.hospital.hospitals);
  const vaccines = useSelector((state) => state.vaccine.vaccines);

  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const appointmentData = {
      user: user._id,
      hospital: selectedHospital,
      vaccine: selectedVaccine,
      scheduledDate,
      status: 'Pending Approval'
    };

    try {
      const res = await axios.post('http://localhost:8082/api/appointments/addAppointment', appointmentData);
      dispatch(addAppointment(res.data));
      alert('Appointment scheduled successfully!');

      setSelectedHospital('');
      setSelectedVaccine('');
      setScheduledDate('');
      dispatch(selectAppointment(appointmentData))
      navigate('/schedule')
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      alert('Failed to schedule appointment.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="appointment-form-container">
      <h2>Schedule Appointment</h2>

      <label>Hospital:</label>
      <select
        value={selectedHospital}
        onChange={(e) => setSelectedHospital(e.target.value)}
        required
      >
        <option value="">Select Hospital</option>
        {hospitals.map((hosp) => (
          <option key={hosp._id} value={hosp._id}>
            {hosp.name}
          </option>
        ))}
      </select>

      <br />

      <label>Vaccine:</label>
      <select
        value={selectedVaccine}
        onChange={(e) => setSelectedVaccine(e.target.value)}
        required
      >
        <option value="">Select Vaccine</option>
        {vaccines.map((vac) => (
          <option key={vac._id} value={vac._id}>
            {vac.name}
          </option>
        ))}
      </select>

      <br />

      <label>Date:</label>
      <input
        type="date"
        value={scheduledDate}
        onChange={(e) => setScheduledDate(e.target.value)}
        required
      />

      <br />

      <button type="submit">Schedule</button>
    </form>
  );
};

export default Appointments;
