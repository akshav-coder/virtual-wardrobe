import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Analytics API slice
export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api/analytics",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Analytics"],
  endpoints: (builder) => ({
    // Track analytics event
    trackEvent: builder.mutation({
      query: (eventData) => ({
        url: "/track",
        method: "POST",
        body: eventData,
      }),
      invalidatesTags: ["Analytics"],
    }),

    // Get analytics events
    getEvents: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/events?${queryParams.toString()}`;
      },
      providesTags: ["Analytics"],
    }),

    // Get analytics dashboard
    getDashboard: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/dashboard?${queryParams.toString()}`;
      },
      providesTags: ["Analytics"],
    }),

    // Get user statistics
    getUserStats: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/stats?${queryParams.toString()}`;
      },
      providesTags: ["Analytics"],
    }),

    // Get event type statistics
    getEventTypeStats: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/event-types?${queryParams.toString()}`;
      },
      providesTags: ["Analytics"],
    }),

    // Get category statistics
    getCategoryStats: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/categories?${queryParams.toString()}`;
      },
      providesTags: ["Analytics"],
    }),

    // Get daily activity
    getDailyActivity: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/daily?${queryParams.toString()}`;
      },
      providesTags: ["Analytics"],
    }),

    // Get hourly activity
    getHourlyActivity: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/hourly?${queryParams.toString()}`;
      },
      providesTags: ["Analytics"],
    }),

    // Get item statistics
    getItemStats: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/items?${queryParams.toString()}`;
      },
      providesTags: ["Analytics"],
    }),

    // Get search statistics
    getSearchStats: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/searches?${queryParams.toString()}`;
      },
      providesTags: ["Analytics"],
    }),

    // Get recommendation statistics
    getRecommendationStats: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/recommendations?${queryParams.toString()}`;
      },
      providesTags: ["Analytics"],
    }),

    // Get wardrobe insights
    getWardrobeInsights: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/wardrobe?${queryParams.toString()}`;
      },
      providesTags: ["Analytics"],
    }),

    // Get user behavior patterns
    getBehaviorPatterns: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/behavior?${queryParams.toString()}`;
      },
      providesTags: ["Analytics"],
    }),

    // Get performance metrics
    getPerformanceMetrics: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/performance?${queryParams.toString()}`;
      },
      providesTags: ["Analytics"],
    }),

    // Export analytics data
    exportAnalytics: builder.mutation({
      query: (params = {}) => ({
        url: "/export",
        method: "POST",
        body: params,
      }),
    }),
  }),
});

// Export hooks
export const {
  useTrackEventMutation,
  useGetEventsQuery,
  useGetDashboardQuery,
  useGetUserStatsQuery,
  useGetEventTypeStatsQuery,
  useGetCategoryStatsQuery,
  useGetDailyActivityQuery,
  useGetHourlyActivityQuery,
  useGetItemStatsQuery,
  useGetSearchStatsQuery,
  useGetRecommendationStatsQuery,
  useGetWardrobeInsightsQuery,
  useGetBehaviorPatternsQuery,
  useGetPerformanceMetricsQuery,
  useExportAnalyticsMutation,
} = analyticsApi;

export default analyticsApi;
