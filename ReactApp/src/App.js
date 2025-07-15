import React from 'react';
import UserForm from './components/loginForm';
import RegisterForm from './components/registerForm'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/global.css';
import DisplayHospitals from './components/DisplayHospitals';
import DisplayVaccines from './components/DisplayVaccines';
import AppointmentForm from './components/Appointments';
import Schedule from './components/Schedule';
import AdminApproval from './components/AdminApproval';
import PieChart from './components/PieChart';
console.log("AdminApproval component is:", AdminApproval);
const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route path="/login" element={<UserForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/home" element={<PieChart />} />
        <Route path="/hospitals" element={<DisplayHospitals />} />
        <Route path="/vaccines" element={<DisplayVaccines />} />
        <Route path="/appointments" element={<AppointmentForm />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/adminApproval" element={<AdminApproval />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
