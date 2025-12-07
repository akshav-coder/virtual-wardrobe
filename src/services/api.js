import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: "http://192.168.0.100:3001/api",
  prepareHeaders: (headers, { getState, endpoint }) => {
    // Get token from Redux state
    const token = getState().auth?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    // Only set Content-Type to application/json if it's not already set
    // AND if it's not the uploadImage endpoint (which needs multipart/form-data handled by browser)
    if (!headers.has("Content-Type") && endpoint !== "uploadImage") {
      headers.set("Content-Type", "application/json");
    }
    return headers;
  },
});

// Base query with error handling and logging
const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Log Request
  const url = typeof args === 'string' ? args : args.url;
  const method = typeof args === 'string' ? 'GET' : (args.method || 'GET');
  console.log(`🚀 API Request: [${method}] ${url}`, typeof args !== 'string' ? args.body : '');

  let result = await baseQuery(args, api, extraOptions);

  // Log Response or Error
  if (result.error) {
    console.log(`❌ API Error: [${method}] ${url} [${result.error.status}]`, result.error);

    if (result.error.status === 401) {
      // Token expired, clear auth state
      api.dispatch({ type: "auth/logout" });
    }
  } else {
    console.log(`✅ API Response: [${method}] ${url}`, result.data);
  }

  return result;
};

// Main API slice
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
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
