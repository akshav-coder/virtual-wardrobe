import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  settings: {
    style: "casual",
    colors: ["White", "Blue", "Black"],
    brands: ["Uniqlo", "Zara", "H&M"],
    budget: 1000,
    notifications: true,
    theme: "light",
    language: "en",
    units: "metric",
  },
  loading: false,
  error: null,
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updatePreferences: (state, action) => {
      Object.assign(state.settings, action.payload);
    },
    setStyle: (state, action) => {
      state.settings.style = action.payload;
    },
    setColors: (state, action) => {
      state.settings.colors = action.payload;
    },
    addColor: (state, action) => {
      if (!state.settings.colors.includes(action.payload)) {
        state.settings.colors.push(action.payload);
      }
    },
    removeColor: (state, action) => {
      state.settings.colors = state.settings.colors.filter(
        (color) => color !== action.payload
      );
    },
    setBrands: (state, action) => {
      state.settings.brands = action.payload;
    },
    addBrand: (state, action) => {
      if (!state.settings.brands.includes(action.payload)) {
        state.settings.brands.push(action.payload);
      }
    },
    removeBrand: (state, action) => {
      state.settings.brands = state.settings.brands.filter(
        (brand) => brand !== action.payload
      );
    },
    setBudget: (state, action) => {
      state.settings.budget = action.payload;
    },
    setNotifications: (state, action) => {
      state.settings.notifications = action.payload;
    },
    setTheme: (state, action) => {
      state.settings.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.settings.language = action.payload;
    },
    setUnits: (state, action) => {
      state.settings.units = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  updatePreferences,
  setStyle,
  setColors,
  addColor,
  removeColor,
  setBrands,
  addBrand,
  removeBrand,
  setBudget,
  setNotifications,
  setTheme,
  setLanguage,
  setUnits,
  clearError,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
