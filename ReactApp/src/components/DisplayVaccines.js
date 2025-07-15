import React, { use, useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/displayVaccines.css'; 
import { useDispatch, useSelector } from 'react-redux';
import { setVaccines, addVaccine, deleteVaccine, updateVaccine } from '../state/vaccine/vaccineSlice'; 


const DisplayVaccines = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const vaccines = useSelector((state) => state.vaccine.vaccines);
  const [newVaccine, setNewVaccine] = useState({
    name: '',
    type: '',
    price: '',
    sideEffect: '',
    origin: '',
    doses: '',
    strainCoverage: ''
  });
  const [editingVaccine, setEditingVaccine] = useState(null);



  const handleChange = (e) => {
    setNewVaccine({ ...newVaccine, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8082/api/vaccines/addVaccine', newVaccine)
      .then(res => {
        dispatch(addVaccine(res.data.vaccine))
        console.log("Vaccine id: ", res.data.vaccine._id)
        setEditingVaccine(null)
        setNewVaccine({ name: '', type: '', price: '', sideEffect: '', origin: '', doses: '', strainCoverage: '' });
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8082/api/vaccines/deleteVaccine/${id}`)
      .then(() => {
        dispatch(deleteVaccine(id))
      })
      .catch(err => console.error(err));
  };

  const handleEdit = (vaccine) => {
    setEditingVaccine({ ...vaccine });
  };

  const handleEditChange = (e) => {
    setEditingVaccine({ ...editingVaccine, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = () => {
    axios.put(`http://localhost:8082/api/vaccines/updateVaccine/${editingVaccine._id}`, editingVaccine)
      .then(res => {
        setEditingVaccine(null);
        dispatch(updateVaccine(res.data));
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="vaccine-container">
      <h2>Vaccines</h2>
      {user.username === "admin" && (
        <form onSubmit={handleAdd} className="vaccine-form">
          {Object.keys(newVaccine).map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field}
              value={newVaccine[field]}
              onChange={handleChange}
              required
            />
          ))}
          <button type="submit">Add Vaccine</button>
        </form>
      )}


      <div className="vaccine-grid">
        {vaccines.map(vaccine => (
          <div className="vaccine-card" key={vaccine._id}>
            {editingVaccine?._id === vaccine._id ? (
              <>
                {Object.keys(editingVaccine).filter(key => key !== '_id').map(field => (
                    <input
                      key={field}
                      name={field}
                      value={editingVaccine[field]}
                      onChange={handleEditChange}
                    />
                  ))}
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={() => setEditingVaccine(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h3>{vaccine.name}</h3>
                <p><strong>Type:</strong> {vaccine.type}</p>
                <p><strong>Price:</strong> ${vaccine.price}</p>
                <p><strong>Side Effect:</strong> {vaccine.sideEffect}</p>
                <p><strong>Origin:</strong> {vaccine.origin}</p>
                <p><strong>Doses:</strong> {vaccine.doses}</p>
                <p><strong>Strain Coverage:</strong> {vaccine.strainCoverage}</p>
                {user.username === "admin" && (
                  <>
                  <button onClick={() => handleEdit(vaccine)}>Edit</button>
                  <button onClick={() => handleDelete(vaccine._id)}>Delete</button>
                  </>
                )}

              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayVaccines;
