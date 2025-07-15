import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  vaccines: [],          
  selectedVaccine: null, 
};

const vaccineSlice = createSlice({
  name: 'vaccine',
  initialState,
  reducers: {
    setVaccines: (state, action) => {
      state.vaccines = action.payload; 
    },
    selectVaccine: (state, action) => {
      state.selectedVaccine = action.payload; 
    },
    clearSelectedVaccine: (state) => {
      state.selectedVaccine = null;
    },
    addVaccine: (state, action) => {
      state.vaccines.push(action.payload);
    },
    deleteVaccine: (state, action) => {
      state.vaccines = state.vaccines.filter(
        (vaccine) => vaccine._id !== action.payload
      );
    },
    updateVaccine: (state, action) => {
      const updated = action.payload;
      const index = state.vaccines.findIndex((v) => v._id === updated._id);
      if (index !== -1) {
        state.vaccines[index] = updated;
      }
    },
  }
});

export const { setVaccines, selectVaccine, clearSelectedVaccine, addVaccine, deleteVaccine, updateVaccine } = vaccineSlice.actions;
export default vaccineSlice.reducer;
