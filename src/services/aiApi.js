import { api } from "./api";

// AI API slice
export const aiApi = api.injectEndpoints({
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
        return `ai/recommendations?${queryParams.toString()}`;
      },
      providesTags: ["AIRecommendation"],
    }),

    // Generate new AI recommendations
    generateRecommendations: builder.mutation({
      query: (params = {}) => ({
        url: "ai/recommendations/generate",
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["AIRecommendation"],
    }),

    // Add feedback to recommendation
    addFeedback: builder.mutation({
      query: ({ id, feedback }) => ({
        url: `ai/recommendations/${id}/feedback`,
        method: "PUT",
        body: feedback,
      }),
      invalidatesTags: (result, error, { id }) => [
        "AIRecommendation",
        { type: "AIRecommendation", id },
      ],
    }),

    // Get AI statistics
    getAiStats: builder.query({
      query: () => "ai/stats",
      providesTags: ["AIRecommendation"],
    }),

    // Get style analysis
    getStyleAnalysis: builder.query({
      query: () => "ai/style-analysis",
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
        return `ai/color-recommendations?${queryParams.toString()}`;
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
        return `ai/occasion-recommendations?${queryParams.toString()}`;
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
        return `ai/weather-recommendations?${queryParams.toString()}`;
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
        return `ai/personalized?${queryParams.toString()}`;
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
        return `ai/history?${queryParams.toString()}`;
      },
      providesTags: ["AIRecommendation"],
    }),

    // Delete recommendation
    deleteRecommendation: builder.mutation({
      query: (id) => ({
        url: `ai/recommendations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AIRecommendation"],
    }),

    // Get recommendation preferences
    getPreferences: builder.query({
      query: () => "ai/preferences",
      providesTags: ["AIRecommendation"],
    }),

    // Update recommendation preferences
    updateAiPreferences: builder.mutation({
      query: (preferences) => ({
        url: "ai/preferences",
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
  useGetAiStatsQuery,
  useGetStyleAnalysisQuery,
  useGetColorRecommendationsQuery,
  useGetOccasionRecommendationsQuery,
  useGetWeatherRecommendationsQuery,
  useGetPersonalizedRecommendationsQuery,
  useGetRecommendationHistoryQuery,
  useDeleteRecommendationMutation,
  useGetPreferencesQuery,
  useUpdateAiPreferencesMutation,
} = aiApi;

export default aiApi;
