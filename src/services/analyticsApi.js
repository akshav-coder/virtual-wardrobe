import { api } from "./api";

// Analytics API slice
export const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Track analytics event
    trackEvent: builder.mutation({
      query: (eventData) => ({
        url: "analytics/track",
        method: "POST",
        body: eventData,
      }),
      invalidatesTags: ["Analytics"],
    }),

    // Get analytics events
    getAnalyticsEvents: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `analytics/events?${queryParams.toString()}`;
      },
      providesTags: ["Analytics"],
    }),

    // Get analytics dashboard
    getAnalyticsDashboard: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `analytics/dashboard?${queryParams.toString()}`;
      },
      providesTags: ["Analytics"],
    }),

    // Get user statistics
    getAnalyticsUserStats: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `analytics/stats?${queryParams.toString()}`;
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
        return `analytics/event-types?${queryParams.toString()}`;
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
        return `analytics/categories?${queryParams.toString()}`;
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
        return `analytics/daily?${queryParams.toString()}`;
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
        return `analytics/hourly?${queryParams.toString()}`;
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
        return `analytics/items?${queryParams.toString()}`;
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
        return `analytics/searches?${queryParams.toString()}`;
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
        return `analytics/recommendations?${queryParams.toString()}`;
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
        return `analytics/wardrobe?${queryParams.toString()}`;
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
        return `analytics/behavior?${queryParams.toString()}`;
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
        return `analytics/performance?${queryParams.toString()}`;
      },
      providesTags: ["Analytics"],
    }),

    // Export analytics data
    exportAnalytics: builder.mutation({
      query: (params = {}) => ({
        url: "analytics/export",
        method: "POST",
        body: params,
      }),
    }),
  }),
});

// Export hooks
export const {
  useTrackEventMutation,
  useGetAnalyticsEventsQuery,
  useGetAnalyticsDashboardQuery,
  useGetAnalyticsUserStatsQuery,
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
