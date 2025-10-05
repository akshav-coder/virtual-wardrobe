import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "../services/api";
import authApi from "../services/authApi";
import userApi from "../services/userApi";
import wardrobeApi from "../services/wardrobeApi";
import outfitApi from "../services/outfitApi";
import weatherApi from "../services/weatherApi";
import aiApi from "../services/aiApi";
import calendarApi from "../services/calendarApi";
import imageApi from "../services/imageApi";
import analyticsApi from "../services/analyticsApi";
import authReducer from "./slices/authSlice";
import wardrobeReducer from "./slices/wardrobeSlice";
import outfitReducer from "./slices/outfitSlice";
import userReducer from "./slices/userSlice";
import weatherReducer from "./slices/weatherSlice";
import preferencesReducer from "./slices/preferencesSlice";
import tourReducer from "./slices/tourSlice";

export const store = configureStore({
  reducer: {
    // API slices
    [api.reducerPath]: api.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [wardrobeApi.reducerPath]: wardrobeApi.reducer,
    [outfitApi.reducerPath]: outfitApi.reducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
    [calendarApi.reducerPath]: calendarApi.reducer,
    [imageApi.reducerPath]: imageApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    // Local slices
    auth: authReducer,
    wardrobe: wardrobeReducer,
    outfits: outfitReducer,
    user: userReducer,
    weather: weatherReducer,
    preferences: preferencesReducer,
    tour: tourReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          api.util.resetApiState.type,
          authApi.util.resetApiState.type,
          userApi.util.resetApiState.type,
          wardrobeApi.util.resetApiState.type,
          outfitApi.util.resetApiState.type,
          weatherApi.util.resetApiState.type,
          aiApi.util.resetApiState.type,
          calendarApi.util.resetApiState.type,
          imageApi.util.resetApiState.type,
          analyticsApi.util.resetApiState.type,
        ],
      },
    }).concat(
      api.middleware,
      authApi.middleware,
      userApi.middleware,
      wardrobeApi.middleware,
      outfitApi.middleware,
      weatherApi.middleware,
      aiApi.middleware,
      calendarApi.middleware,
      imageApi.middleware,
      analyticsApi.middleware
    ),
});

setupListeners(store.dispatch);

// Export store for use in components
export default store;
