import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    username: '',
    name: '',
    age: '',
    gender: '',
    profession: '',
    contact: '',
    address: '',
    disease: '',
    medicalCertificate: ''
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUserToStore: (state, action) => {
      state.user = action.payload;
    }
  }
});

export const { addUserToStore } = userSlice.actions;
export default userSlice.reducer;
