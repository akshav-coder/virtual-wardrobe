import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Weather API slice
export const weatherApi = createApi({
  reducerPath: "weatherApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.74.215.78:3001/api/weather",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Weather"],
  endpoints: (builder) => ({
    // Set user location
    setLocation: builder.mutation({
      query: (locationData) => ({
        url: "/location",
        method: "POST",
        body: locationData,
      }),
      invalidatesTags: ["Weather"],
    }),

    // Get current weather
    getCurrentWeather: builder.query({
      query: () => "/current",
      providesTags: ["Weather"],
    }),

    // Get weather forecast
    getForecast: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/forecast?${queryParams.toString()}`;
      },
      providesTags: ["Weather"],
    }),

    // Get weather alerts
    getAlerts: builder.query({
      query: () => "/alerts",
      providesTags: ["Weather"],
    }),

    // Get weather history
    getHistory: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/history?${queryParams.toString()}`;
      },
      providesTags: ["Weather"],
    }),

    // Get weather statistics
    getStats: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/stats?${queryParams.toString()}`;
      },
      providesTags: ["Weather"],
    }),

    // Refresh weather data
    refreshWeather: builder.mutation({
      query: () => ({
        url: "/refresh",
        method: "PUT",
      }),
      invalidatesTags: ["Weather"],
    }),

    // Get weather-based outfit recommendations
    getOutfitRecommendations: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/recommendations?${queryParams.toString()}`;
      },
      providesTags: ["Weather"],
    }),

    // Get weather data by coordinates
    getWeatherByCoordinates: builder.query({
      query: ({ latitude, longitude }) =>
        `/coordinates?latitude=${latitude}&longitude=${longitude}`,
      providesTags: ["Weather"],
    }),

    // Get weather data by city
    getWeatherByCity: builder.query({
      query: (city) => `/city?name=${encodeURIComponent(city)}`,
      providesTags: ["Weather"],
    }),

    // Get weather comparison
    getWeatherComparison: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/comparison?${queryParams.toString()}`;
      },
      providesTags: ["Weather"],
    }),
  }),
});

// Export hooks
export const {
  useSetLocationMutation,
  useGetCurrentWeatherQuery,
  useGetForecastQuery,
  useGetAlertsQuery,
  useGetHistoryQuery,
  useGetStatsQuery,
  useRefreshWeatherMutation,
  useGetOutfitRecommendationsQuery,
  useGetWeatherByCoordinatesQuery,
  useGetWeatherByCityQuery,
  useGetWeatherComparisonQuery,
} = weatherApi;

export default weatherApi;
