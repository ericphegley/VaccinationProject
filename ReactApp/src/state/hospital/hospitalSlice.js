import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hospitals: [],          
  selectedHospital: null, 
};

const hospitalSlice = createSlice({
  name: 'hospital',
  initialState,
  reducers: {
    setHospitals: (state, action) => {
      state.hospitals = action.payload; 
    },
    selectHospital: (state, action) => {
      state.selectedHospital = action.payload; 
    },
    clearSelectedHospital: (state) => {
      state.selectedHospital = null;
    }
  }
});

export const { setHospitals, selectHospital, clearSelectedHospital } = hospitalSlice.actions;
export default hospitalSlice.reducer;
