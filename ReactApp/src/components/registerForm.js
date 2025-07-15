import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import '../styles/registerForm.css';

function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    age: 0,
    gender: '',
    profession: '',
    contact: '',
    address: '',
    disease: '',
    medicalCertificate: '', 
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
    const response = await fetch('http://localhost:8082/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    console.log(response)
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    navigate('/login')
  } catch (error) {
    console.error('Error:', error.message);
  }
};

  return (
    <div className="register-form-container">
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((field) => (
          <div key={field}>
            <label>{field}</label>
            <input
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>

  );
}

export default RegisterForm;
