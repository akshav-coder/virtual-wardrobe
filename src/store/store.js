import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./api/apiSlice";
import wardrobeReducer from "./slices/wardrobeSlice";
import outfitReducer from "./slices/outfitSlice";
import userReducer from "./slices/userSlice";
import weatherReducer from "./slices/weatherSlice";
import preferencesReducer from "./slices/preferencesSlice";
import tourReducer from "./slices/tourSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
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
        ignoredActions: [api.util.resetApiState.type],
      },
    }).concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
