import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Outfit API slice
export const outfitApi = createApi({
  reducerPath: "outfitApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.0.102:3001/api/outfit",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Outfit"],
  endpoints: (builder) => ({
    // Get outfits
    getOutfits: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/?${queryParams.toString()}`;
      },
      providesTags: ["Outfit"],
    }),

    // Get single outfit
    getOutfit: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Outfit", id }],
    }),

    // Create outfit
    createOutfit: builder.mutation({
      query: (outfitData) => ({
        url: "/",
        method: "POST",
        body: outfitData,
      }),
      invalidatesTags: ["Outfit"],
    }),

    // Update outfit
    updateOutfit: builder.mutation({
      query: ({ id, ...outfitData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: outfitData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Outfit",
        { type: "Outfit", id },
      ],
    }),

    // Delete outfit
    deleteOutfit: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Outfit"],
    }),

    // Add item to outfit
    addItem: builder.mutation({
      query: ({ id, itemId, position = "primary" }) => ({
        url: `/${id}/items`,
        method: "POST",
        body: { itemId, position },
      }),
      invalidatesTags: (result, error, { id }) => [
        "Outfit",
        { type: "Outfit", id },
      ],
    }),

    // Remove item from outfit
    removeItem: builder.mutation({
      query: ({ id, itemId }) => ({
        url: `/${id}/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        "Outfit",
        { type: "Outfit", id },
      ],
    }),

    // Update item in outfit
    updateItem: builder.mutation({
      query: ({ id, itemId, updates }) => ({
        url: `/${id}/items/${itemId}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Outfit",
        { type: "Outfit", id },
      ],
    }),

    // Search outfits
    searchOutfits: builder.query({
      query: (searchParams) => {
        const queryParams = new URLSearchParams();
        Object.keys(searchParams).forEach((key) => {
          if (searchParams[key] !== undefined && searchParams[key] !== null) {
            queryParams.append(key, searchParams[key]);
          }
        });
        return `/search?${queryParams.toString()}`;
      },
      providesTags: ["Outfit"],
    }),

    // Get favorite outfits
    getFavorites: builder.query({
      query: () => "/favorites",
      providesTags: ["Outfit"],
    }),

    // Toggle favorite status
    toggleFavorite: builder.mutation({
      query: (id) => ({
        url: `/${id}/favorite`,
        method: "PUT",
      }),
      invalidatesTags: ["Outfit"],
    }),

    // Increment wear count
    incrementWearCount: builder.mutation({
      query: (id) => ({
        url: `/${id}/wear`,
        method: "PUT",
      }),
      invalidatesTags: ["Outfit"],
    }),

    // Get outfit templates
    getTemplates: builder.query({
      query: () => "/templates",
      providesTags: ["Outfit"],
    }),

    // Create outfit from template
    createFromTemplate: builder.mutation({
      query: ({ templateId, customizations = {} }) => ({
        url: "/templates",
        method: "POST",
        body: { templateId, customizations },
      }),
      invalidatesTags: ["Outfit"],
    }),

    // Get scheduled outfits
    getScheduledOutfits: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/scheduled?${queryParams.toString()}`;
      },
      providesTags: ["Outfit"],
    }),

    // Schedule outfit
    scheduleOutfit: builder.mutation({
      query: ({ id, date, eventId }) => ({
        url: `/${id}/schedule`,
        method: "POST",
        body: { date, eventId },
      }),
      invalidatesTags: ["Outfit"],
    }),

    // Get weather-based outfits
    getWeatherBasedOutfits: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/weather-based?${queryParams.toString()}`;
      },
      providesTags: ["Outfit"],
    }),

    // Get outfit statistics
    getStats: builder.query({
      query: () => "/stats",
      providesTags: ["Outfit"],
    }),

    // Get outfit analytics
    getAnalytics: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/analytics?${queryParams.toString()}`;
      },
      providesTags: ["Outfit"],
    }),
  }),
});

// Export hooks
export const {
  useGetOutfitsQuery,
  useGetOutfitQuery,
  useCreateOutfitMutation,
  useUpdateOutfitMutation,
  useDeleteOutfitMutation,
  useAddItemMutation,
  useRemoveItemMutation,
  useUpdateItemMutation,
  useSearchOutfitsQuery,
  useGetFavoritesQuery,
  useToggleFavoriteMutation,
  useIncrementWearCountMutation,
  useGetTemplatesQuery,
  useCreateFromTemplateMutation,
  useGetScheduledOutfitsQuery,
  useScheduleOutfitMutation,
  useGetWeatherBasedOutfitsQuery,
  useGetStatsQuery,
  useGetAnalyticsQuery,
} = outfitApi;

export default outfitApi;
