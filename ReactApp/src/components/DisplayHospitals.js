import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { setHospitals, selectHospital, clearSelectedHospital } from '../state/hospital/hospitalSlice';


const DisplayHospitals = () => {
  const hospitals = useSelector((state) => state.hospital.hospitals);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const [newHospital, setNewHospital] = useState({
    name: '',
    address: '',
    type: '',
    charges: ''
  });
  const [editingHospital, setEditingHospital] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    address: '',
    type: '',
    charges: ''
  });

  const handleEdit = (hospital) => {
    setEditingHospital(hospital);
    setEditFormData({
      name: hospital.name,
      address: hospital.address,
      type: hospital.type,
      charges: hospital.charges
    });
    console.log("Edit hospital:", hospital);
  };
  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setEditingHospital(null);
  };

const handleSaveEdit = () => {
  axios.put(`http://localhost:8082/api/hospitals/updateHospital/${editingHospital._id}`, editFormData)
    .then(() => {
    const updatedHospitals = hospitals.map(h =>
      h._id === editingHospital._id ? { ...editFormData, _id: editingHospital._id } : h
    );
    dispatch(setHospitals(updatedHospitals));
      closeModal();
    })
    .catch(error => {
      console.error("Error updating hospital:", error);
    });
};

  const handleDelete = (hospitalId) => {
    axios.delete(`http://localhost:8082/api/hospitals/deleteHospital/${hospitalId}`)
      .then(() => {
        dispatch(setHospitals(hospitals.filter(h => h._id !== hospitalId)));
      })
      .catch(error => {
        console.error("Error deleting hospital:", error);
      });
  };

  const handleChange = (e) => {
    setNewHospital({ ...newHospital, [e.target.name]: e.target.value });
  };

  const handleAddHospital = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8082/api/hospitals/addHospital', newHospital)
      .then(response => {
        dispatch(setHospitals([...hospitals, response.data.hospital]));
        setNewHospital({ name: '', address: '', type: '', charges: '' }); 
      })
      .catch(error => {
        console.error("Error adding hospital:", error);
      });
  };

  return (
    <div className="hospital-container">
      <h2>Available Hospitals</h2>
      {hospitals.length === 0 ? (
        <p>No hospitals available.</p>
      ) : (
        <table className="hospital-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Type</th>
              <th>Charges</th>
              {user.username === 'admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hospital) => (
              <tr key={hospital._id}>
                <td>{hospital.name}</td>
                <td>{hospital.address}</td>
                <td>{hospital.type}</td>
                <td>${hospital.charges}</td>
                 {user.username === 'admin' && (
                  <td>
                    <button onClick={() => handleEdit(hospital)}>Edit</button>
                    <button onClick={() => handleDelete(hospital._id)} style={{ marginLeft: '0.5rem' }}>
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}


      {user.username === 'admin' && (
        <div style={{ marginBottom: '2rem' }}>
          <h3>Add Hospital</h3>
          <form className="add-hospital-form" onSubmit={handleAddHospital}>
            <input type="text" name="name" placeholder="Name" value={newHospital.name} onChange={handleChange} required />
            <input type="text" name="address" placeholder="Address" value={newHospital.address} onChange={handleChange} required />
            <input type="text" name="type" placeholder="Type" value={newHospital.type} onChange={handleChange} required />
            <input type="number" name="charges" placeholder="Charges" value={newHospital.charges} onChange={handleChange} required />
            <button type="submit">Add Hospital</button>
          </form>
        </div>
      )}
      <Modal
        isOpen={!!editingHospital}
        onRequestClose={closeModal}
        contentLabel="Edit Hospital"
        style={{
          content: {
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '2rem',
            borderRadius: '8px',
            width: '400px'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }
        }}
      >
        <h3>Edit Hospital</h3>
        <label>
          Name:
          <input name="name" value={editFormData.name} onChange={handleEditChange} />
        </label><br />
        <label>
          Address:
          <input name="address" value={editFormData.address} onChange={handleEditChange} />
        </label><br />
        <label>
          Type:
          <input name="type" value={editFormData.type} onChange={handleEditChange} />
        </label><br />
        <label>
          Charges:
          <input name="charges" type="number" value={editFormData.charges} onChange={handleEditChange} />
        </label><br /><br />
        <div className="modal-buttons">
          <button onClick={handleSaveEdit}>Save</button>
          <button onClick={closeModal} style={{ marginLeft: '0.5rem' }}>Cancel</button>
        </div>

      </Modal>

    </div>
  );
};

export default DisplayHospitals;
