import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOnboardingComplete: false,
  isTourVisible: false,
  currentTourStep: 0,
  hasSeenWelcome: false,
  tourPreferences: {
    showTips: true,
    showHints: true,
    autoAdvance: false,
  },
  completedTours: {
    home: false,
    wardrobe: false,
    planner: false,
    stylist: false,
    profile: false,
  },
};

const tourSlice = createSlice({
  name: "tour",
  initialState,
  reducers: {
    startTour: (state) => {
      state.isTourVisible = true;
      state.currentTourStep = 0;
    },
    stopTour: (state) => {
      state.isTourVisible = false;
      state.currentTourStep = 0;
    },
    nextTourStep: (state) => {
      if (state.currentTourStep < 7) {
        // 8 steps total (0-7)
        state.currentTourStep += 1;
      }
    },
    prevTourStep: (state) => {
      if (state.currentTourStep > 0) {
        state.currentTourStep -= 1;
      }
    },
    setTourStep: (state, action) => {
      state.currentTourStep = action.payload;
    },
    completeOnboarding: (state) => {
      state.isOnboardingComplete = true;
      state.isTourVisible = false;
      state.hasSeenWelcome = true;
    },
    skipOnboarding: (state) => {
      state.isOnboardingComplete = true;
      state.isTourVisible = false;
    },
    setWelcomeSeen: (state) => {
      state.hasSeenWelcome = true;
    },
    updateTourPreferences: (state, action) => {
      state.tourPreferences = { ...state.tourPreferences, ...action.payload };
    },
    completeScreenTour: (state, action) => {
      const screen = action.payload;
      if (state.completedTours.hasOwnProperty(screen)) {
        state.completedTours[screen] = true;
      }
    },
    resetTour: (state) => {
      state.isOnboardingComplete = false;
      state.isTourVisible = false;
      state.currentTourStep = 0;
      state.hasSeenWelcome = false;
      state.completedTours = {
        home: false,
        wardrobe: false,
        planner: false,
        stylist: false,
        profile: false,
      };
    },
  },
});

export const {
  startTour,
  stopTour,
  nextTourStep,
  prevTourStep,
  setTourStep,
  completeOnboarding,
  skipOnboarding,
  setWelcomeSeen,
  updateTourPreferences,
  completeScreenTour,
  resetTour,
} = tourSlice.actions;

export default tourSlice.reducer;
