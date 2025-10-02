import { createSlice } from "@reduxjs/toolkit";
import { demoUser } from "../../data/demoData";

const initialState = {
  user: demoUser,
  isAuthenticated: true,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    updateUserPreferences: (state, action) => {
      state.user.preferences = { ...state.user.preferences, ...action.payload };
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setUser,
  updateUser,
  updateUserPreferences,
  logout,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
