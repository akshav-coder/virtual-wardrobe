import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "../services/api";
import authReducer from "./slices/authSlice";
import preferencesReducer from "./slices/preferencesSlice";
import tourReducer from "./slices/tourSlice";

export const store = configureStore({
  reducer: {
    // API slice
    [api.reducerPath]: api.reducer,
    // Local slices
    auth: authReducer,
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

// Export store for use in components
export default store;
