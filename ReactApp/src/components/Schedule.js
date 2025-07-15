import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Schedule = () => {
  const user = useSelector((state) => state.user.user);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`http://localhost:8082/api/appointments/user/${user._id}`);
        setAppointments(res.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user._id]);

  const handlePay = async (id) => {
    try {
      const res = await axios.put(`http://localhost:8082/api/appointments/${id}/status`, {
        status: 'Paid & Scheduled'
      });

      setAppointments(prev =>
        prev.map(app => (app._id === id ? res.data : app))
      );
    } catch (error) {
      console.error('Failed to update appointment status:', error);
      alert('Failed to update appointment status.');
    }
  };

  const now = new Date();
  const upcoming = appointments.filter(app => new Date(app.scheduledDate) > now);
  const past = appointments.filter(app => new Date(app.scheduledDate) <= now);

  if (loading) return <p>Loading schedule...</p>;
  if (!user) return <p>Please log in to view your schedule.</p>;

  const renderTable = (title, data, includeSuccessMark = false) => (
    <>
      <h3>{title}</h3>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
            <th>Hospital Name</th>
            <th>Hospital Address</th>
            <th>Hospital Type</th>
            <th>Charges</th>
            <th>Vaccine Name</th>
            <th>Vaccine Type</th>
            <th>Doses Required</th>
            <th>Action</th>
            {includeSuccessMark && <th>Note</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((app) => (
            <tr key={app._id}>
              <td>{new Date(app.scheduledDate).toLocaleString()}</td>
              <td>{app.status}</td>
              <td>{app.hospital?.name}</td>
              <td>{app.hospital?.address}</td>
              <td>{app.hospital?.type}</td>
              <td>${app.hospital?.charges}</td>
              <td>{app.vaccine?.name}</td>
              <td>{app.vaccine?.type}</td>
              <td>{app.vaccine?.doses}</td>
              <td>
                {app.status === 'Approved' ? (
                  <button onClick={() => handlePay(app._id)}>Pay</button>
                ) : ''}
              </td>
              {includeSuccessMark && (
                <td style={{ color: 'green', fontWeight: 'bold' }}>✅ Successfully Vaccinated</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Schedule for {user.username}</h2>

      {upcoming.length > 0 && renderTable('Upcoming Appointments', upcoming)}

      {past.length > 0 && renderTable('Vaccination History', past, true)}

      {upcoming.length === 0 && past.length === 0 && (
        <p>No appointments scheduled.</p>
      )}
    </div>
  );
};

export default Schedule;
