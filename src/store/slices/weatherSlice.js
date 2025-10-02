import { createSlice } from "@reduxjs/toolkit";
import { demoWeather } from "../../data/demoData";

const initialState = {
  current: demoWeather,
  forecast: [
    { day: "Today", high: 25, low: 18, description: "Sunny", icon: "sunny" },
    {
      day: "Tomorrow",
      high: 23,
      low: 16,
      description: "Partly Cloudy",
      icon: "partly-sunny",
    },
    { day: "Wed", high: 20, low: 14, description: "Rainy", icon: "rainy" },
    { day: "Thu", high: 18, low: 12, description: "Cloudy", icon: "cloudy" },
    { day: "Fri", high: 21, low: 15, description: "Sunny", icon: "sunny" },
  ],
  location: "New York",
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setWeather: (state, action) => {
      state.current = action.payload;
    },
    setForecast: (state, action) => {
      state.forecast = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    updateWeather: (state, action) => {
      state.current = { ...state.current, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setWeather,
  setForecast,
  setLocation,
  updateWeather,
  clearError,
} = weatherSlice.actions;

export default weatherSlice.reducer;
