import { api } from "./api";

// Weather API slice
export const weatherApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Set user location
    setLocation: builder.mutation({
      query: (locationData) => ({
        url: "weather/location",
        method: "POST",
        body: locationData,
      }),
      invalidatesTags: ["Weather"],
    }),

    // Get current weather
    getCurrentWeather: builder.query({
      query: () => "weather/current",
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
        return `weather/forecast?${queryParams.toString()}`;
      },
      providesTags: ["Weather"],
    }),

    // Get weather alerts
    getAlerts: builder.query({
      query: () => "weather/alerts",
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
        return `weather/history?${queryParams.toString()}`;
      },
      providesTags: ["Weather"],
    }),

    // Get weather statistics
    getWeatherStats: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `weather/stats?${queryParams.toString()}`;
      },
      providesTags: ["Weather"],
    }),

    // Refresh weather data
    refreshWeather: builder.mutation({
      query: () => ({
        url: "weather/refresh",
        method: "PUT",
      }),
      invalidatesTags: ["Weather"],
    }),

    // Get weather-based outfit recommendations
    getWeatherOutfitRecommendations: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `weather/recommendations?${queryParams.toString()}`;
      },
      providesTags: ["Weather"],
    }),

    // Get weather data by coordinates
    getWeatherByCoordinates: builder.query({
      query: ({ latitude, longitude }) =>
        `weather/coordinates?latitude=${latitude}&longitude=${longitude}`,
      providesTags: ["Weather"],
    }),

    // Get weather data by city
    getWeatherByCity: builder.query({
      query: (city) => `weather/city?name=${encodeURIComponent(city)}`,
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
        return `weather/comparison?${queryParams.toString()}`;
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
  useGetWeatherStatsQuery,
  useRefreshWeatherMutation,
  useGetWeatherOutfitRecommendationsQuery,
  useGetWeatherByCoordinatesQuery,
  useGetWeatherByCityQuery,
  useGetWeatherComparisonQuery,
} = weatherApi;

export default weatherApi;
