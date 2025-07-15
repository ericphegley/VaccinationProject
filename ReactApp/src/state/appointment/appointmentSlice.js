import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  selectedAppointment: null,
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
    addAppointment: (state, action) => {
      state.appointments.push(action.payload);
    },
    selectAppointment: (state, action) => {
      state.selectedAppointment = action.payload;
    },
    clearSelectedAppointment: (state) => {
      state.selectedAppointment = null;
    }
  }
});

export const { setAppointments, addAppointment, selectAppointment, clearSelectedAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;
