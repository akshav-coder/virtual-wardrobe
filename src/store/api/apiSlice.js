import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base API URL - for now using mock data, but ready for real API
const API_BASE_URL = "https://api.virtualwardrobe.com/v1";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      const token = getState().user.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Wardrobe", "Outfit", "User", "Weather", "Recommendation"],
  endpoints: (builder) => ({
    // Wardrobe endpoints
    getWardrobeItems: builder.query({
      query: (params = {}) => ({
        url: "/wardrobe",
        params,
      }),
      providesTags: ["Wardrobe"],
    }),
    addWardrobeItem: builder.mutation({
      query: (item) => ({
        url: "/wardrobe",
        method: "POST",
        body: item,
      }),
      invalidatesTags: ["Wardrobe"],
    }),
    updateWardrobeItem: builder.mutation({
      query: ({ id, ...item }) => ({
        url: `/wardrobe/${id}`,
        method: "PUT",
        body: item,
      }),
      invalidatesTags: ["Wardrobe"],
    }),
    deleteWardrobeItem: builder.mutation({
      query: (id) => ({
        url: `/wardrobe/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wardrobe"],
    }),

    // Outfit endpoints
    getOutfits: builder.query({
      query: (params = {}) => ({
        url: "/outfits",
        params,
      }),
      providesTags: ["Outfit"],
    }),
    addOutfit: builder.mutation({
      query: (outfit) => ({
        url: "/outfits",
        method: "POST",
        body: outfit,
      }),
      invalidatesTags: ["Outfit"],
    }),
    updateOutfit: builder.mutation({
      query: ({ id, ...outfit }) => ({
        url: `/outfits/${id}`,
        method: "PUT",
        body: outfit,
      }),
      invalidatesTags: ["Outfit"],
    }),
    deleteOutfit: builder.mutation({
      query: (id) => ({
        url: `/outfits/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Outfit"],
    }),

    // User endpoints
    getUserProfile: builder.query({
      query: () => "/user/profile",
      providesTags: ["User"],
    }),
    updateUserProfile: builder.mutation({
      query: (profile) => ({
        url: "/user/profile",
        method: "PUT",
        body: profile,
      }),
      invalidatesTags: ["User"],
    }),

    // Weather endpoints
    getWeather: builder.query({
      query: ({ lat, lon, city }) => ({
        url: "/weather",
        params: { lat, lon, city },
      }),
      providesTags: ["Weather"],
    }),

    // AI Recommendations
    getRecommendations: builder.query({
      query: (params) => ({
        url: "/recommendations",
        params,
      }),
      providesTags: ["Recommendation"],
    }),
    generateOutfit: builder.mutation({
      query: (params) => ({
        url: "/recommendations/generate-outfit",
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["Recommendation"],
    }),

    // Analytics
    getWardrobeAnalytics: builder.query({
      query: () => "/analytics/wardrobe",
      providesTags: ["Wardrobe"],
    }),
    getOutfitAnalytics: builder.query({
      query: () => "/analytics/outfits",
      providesTags: ["Outfit"],
    }),
  }),
});

export const {
  useGetWardrobeItemsQuery,
  useAddWardrobeItemMutation,
  useUpdateWardrobeItemMutation,
  useDeleteWardrobeItemMutation,
  useGetOutfitsQuery,
  useAddOutfitMutation,
  useUpdateOutfitMutation,
  useDeleteOutfitMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetWeatherQuery,
  useGetRecommendationsQuery,
  useGenerateOutfitMutation,
  useGetWardrobeAnalyticsQuery,
  useGetOutfitAnalyticsQuery,
} = api;
