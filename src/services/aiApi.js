import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// AI API slice
export const aiApi = createApi({
  reducerPath: "aiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.0.102:3001/api/ai",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["AIRecommendation"],
  endpoints: (builder) => ({
    // Get AI recommendations
    getRecommendations: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/recommendations?${queryParams.toString()}`;
      },
      providesTags: ["AIRecommendation"],
    }),

    // Generate new AI recommendations
    generateRecommendations: builder.mutation({
      query: (params = {}) => ({
        url: "/recommendations/generate",
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["AIRecommendation"],
    }),

    // Add feedback to recommendation
    addFeedback: builder.mutation({
      query: ({ id, feedback }) => ({
        url: `/recommendations/${id}/feedback`,
        method: "PUT",
        body: feedback,
      }),
      invalidatesTags: (result, error, { id }) => [
        "AIRecommendation",
        { type: "AIRecommendation", id },
      ],
    }),

    // Get AI statistics
    getStats: builder.query({
      query: () => "/stats",
      providesTags: ["AIRecommendation"],
    }),

    // Get style analysis
    getStyleAnalysis: builder.query({
      query: () => "/style-analysis",
      providesTags: ["AIRecommendation"],
    }),

    // Get color coordination recommendations
    getColorRecommendations: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/color-recommendations?${queryParams.toString()}`;
      },
      providesTags: ["AIRecommendation"],
    }),

    // Get occasion-based recommendations
    getOccasionRecommendations: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/occasion-recommendations?${queryParams.toString()}`;
      },
      providesTags: ["AIRecommendation"],
    }),

    // Get weather-based recommendations
    getWeatherRecommendations: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/weather-recommendations?${queryParams.toString()}`;
      },
      providesTags: ["AIRecommendation"],
    }),

    // Get personalized recommendations
    getPersonalizedRecommendations: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/personalized?${queryParams.toString()}`;
      },
      providesTags: ["AIRecommendation"],
    }),

    // Get recommendation history
    getRecommendationHistory: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/history?${queryParams.toString()}`;
      },
      providesTags: ["AIRecommendation"],
    }),

    // Delete recommendation
    deleteRecommendation: builder.mutation({
      query: (id) => ({
        url: `/recommendations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AIRecommendation"],
    }),

    // Get recommendation preferences
    getPreferences: builder.query({
      query: () => "/preferences",
      providesTags: ["AIRecommendation"],
    }),

    // Update recommendation preferences
    updatePreferences: builder.mutation({
      query: (preferences) => ({
        url: "/preferences",
        method: "PUT",
        body: preferences,
      }),
      invalidatesTags: ["AIRecommendation"],
    }),
  }),
});

// Export hooks
export const {
  useGetRecommendationsQuery,
  useGenerateRecommendationsMutation,
  useAddFeedbackMutation,
  useGetStatsQuery,
  useGetStyleAnalysisQuery,
  useGetColorRecommendationsQuery,
  useGetOccasionRecommendationsQuery,
  useGetWeatherRecommendationsQuery,
  useGetPersonalizedRecommendationsQuery,
  useGetRecommendationHistoryQuery,
  useDeleteRecommendationMutation,
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
} = aiApi;

export default aiApi;
