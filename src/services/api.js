import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: "http://192.168.0.102:3001/api",
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state
    const token = getState().auth?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Base query with error handling
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Token expired, clear auth state
    api.dispatch({ type: "auth/logout" });
  }

  return result;
};

// Main API slice
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "WardrobeItem",
    "Outfit",
    "CalendarEvent",
    "Weather",
    "AIRecommendation",
    "Image",
    "Analytics",
  ],
  endpoints: (builder) => ({
    // Health check
    healthCheck: builder.query({
      query: () => "/health",
    }),
  }),
});

// Export hooks
export const { useHealthCheckQuery } = api;

export default api;
