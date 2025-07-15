import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminApproval = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchScheduledAppointments = async () => {
      try {
        const res = await axios.get('http://localhost:8082/api/appointments/scheduled');
        console.log('Fetched appointments:', res.data);
        setAppointments(res.data);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      }
    };

    fetchScheduledAppointments();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
  try {
    const res = await axios.put(`http://localhost:8082/api/appointments/${id}/status`, {
      status: newStatus
    });

    setAppointments(prev =>
      prev.map(app => (app._id === id ? res.data : app))
    );
  } catch (error) {
    console.error('Failed to update status:', error);
    alert('Failed to update status');
  }
};


  return (
    <div style={{ padding: '2rem' }}>
      <h2>Scheduled Appointments - Admin View</h2>
      {appointments.length === 0 ? (
        <p>No scheduled appointments found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Age</th>
              <th>Hospital</th>
              <th>Vaccine</th>
              <th>Scheduled Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app._id}>
                <td>{app.user?.name}</td>
                <td>{app.user?.age}</td>
                <td>{app.hospital?.name}</td>
                <td>{app.vaccine?.name}</td>
                <td>{new Date(app.scheduledDate).toLocaleDateString()}</td>
                <td>{app.status}</td>
                    <td>
                      <button onClick={() => handleStatusUpdate(app._id, 'Approved')}>
                        Approve
                      </button>
                      <button onClick={() => handleStatusUpdate(app._id, 'Rejected')}>
                        Reject
                      </button>
                    </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminApproval;
