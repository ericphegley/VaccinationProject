import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUserToStore } from '../state/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { setHospitals } from '../state/hospital/hospitalSlice';
import { setVaccines } from '../state/vaccine/vaccineSlice';

import '../styles/loginForm.css';
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function UserForm() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [showMsg, setShowMsg] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:8082/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      setShowMsg(true)
      throw new Error('Invalid credentials');
    }

    const userData = await response.json();

    dispatch(addUserToStore(userData.user));
    const [hospitalsRes, vaccinesRes, usersRes] = await Promise.all([
      fetch('http://localhost:8082/api/hospitals/getHospitals'),
      fetch('http://localhost:8082/api/vaccines/getVaccines')
    ]);

    const hospitals = await hospitalsRes.json();
    const vaccines = await vaccinesRes.json();

    dispatch(setHospitals(hospitals));
    dispatch(setVaccines(vaccines));

    console.log("User saved to backend and store:", userData);
    navigate('/home');

  } catch (error) {
    console.error('Error:', error.message);
  }
};

  return (
    <div className="user-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((field) => (
          <div key={field}>
            <label>{capitalizeFirstLetter(field)}</label>
            <input
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        {showMsg && <p className="error-message">Invalid username or password</p>}
        <div className="btn-group">
          <button type="submit">Submit</button>
          <button type="button" onClick={() => navigate('/register')}>Register</button>
        </div>
      </form>
    </div>

  );
}

export default UserForm;
