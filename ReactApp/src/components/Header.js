import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header() {
  const user = useSelector(state => state.user.user)
  console.log("USER: ", user)
  return (
    <header>
      <h2> Vaccinational</h2>
      <nav>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
        {user.username !== '' ? <NavLink to="/hospitals">Hospitals</NavLink> : ''}
        {user.username !== '' ? <NavLink to="/vaccines">Vaccines</NavLink> : ''}
        {user.username !== '' ? <NavLink to="/appointments">Make Appointment</NavLink> : ''}
        {user.username !== '' ? <NavLink to="/schedule">View Appointments</NavLink> : ''}
        {user.username === "admin" ? <NavLink to="/adminApproval">Approval</NavLink> : ''}
        {user.username !== '' ? <NavLink to="/home">Home</NavLink> : ''}



      </nav>
    </header>
  );
}


export default Header;
