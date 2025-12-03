import { api } from "./api";

// Outfit API slice
export const outfitApi = api.injectEndpoints({
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
        return `outfit/?${queryParams.toString()}`;
      },
      providesTags: ["Outfit"],
    }),

    // Get single outfit
    getOutfit: builder.query({
      query: (id) => `outfit/${id}`,
      providesTags: (result, error, id) => [{ type: "Outfit", id }],
    }),

    // Create outfit
    createOutfit: builder.mutation({
      query: (outfitData) => ({
        url: "outfit/",
        method: "POST",
        body: outfitData,
      }),
      invalidatesTags: ["Outfit"],
    }),

    // Update outfit
    updateOutfit: builder.mutation({
      query: ({ id, ...outfitData }) => ({
        url: `outfit/${id}`,
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
        url: `outfit/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Outfit"],
    }),

    // Add item to outfit
    addItem: builder.mutation({
      query: ({ id, itemId, position = "primary" }) => ({
        url: `outfit/${id}/items`,
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
        url: `outfit/${id}/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        "Outfit",
        { type: "Outfit", id },
      ],
    }),

    // Update item in outfit
    updateOutfitItem: builder.mutation({
      query: ({ id, itemId, updates }) => ({
        url: `outfit/${id}/items/${itemId}`,
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
        return `outfit/search?${queryParams.toString()}`;
      },
      providesTags: ["Outfit"],
    }),

    // Get favorite outfits
    getFavoriteOutfits: builder.query({
      query: () => "outfit/favorites",
      providesTags: ["Outfit"],
    }),

    // Toggle favorite status
    toggleOutfitFavorite: builder.mutation({
      query: (id) => ({
        url: `outfit/${id}/favorite`,
        method: "PUT",
      }),
      invalidatesTags: ["Outfit"],
    }),

    // Increment wear count
    incrementOutfitWearCount: builder.mutation({
      query: (id) => ({
        url: `outfit/${id}/wear`,
        method: "PUT",
      }),
      invalidatesTags: ["Outfit"],
    }),

    // Get outfit templates
    getTemplates: builder.query({
      query: () => "outfit/templates",
      providesTags: ["Outfit"],
    }),

    // Create outfit from template
    createFromTemplate: builder.mutation({
      query: ({ templateId, customizations = {} }) => ({
        url: "outfit/templates",
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
        return `outfit/scheduled?${queryParams.toString()}`;
      },
      providesTags: ["Outfit"],
    }),

    // Schedule outfit
    scheduleOutfit: builder.mutation({
      query: ({ id, date, eventId }) => ({
        url: `outfit/${id}/schedule`,
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
        return `outfit/weather-based?${queryParams.toString()}`;
      },
      providesTags: ["Outfit"],
    }),

    // Get outfit statistics
    getOutfitStats: builder.query({
      query: () => "outfit/stats",
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
        return `outfit/analytics?${queryParams.toString()}`;
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
  useUpdateOutfitItemMutation,
  useSearchOutfitsQuery,
  useGetFavoriteOutfitsQuery,
  useToggleOutfitFavoriteMutation,
  useIncrementOutfitWearCountMutation,
  useGetTemplatesQuery,
  useCreateFromTemplateMutation,
  useGetScheduledOutfitsQuery,
  useScheduleOutfitMutation,
  useGetWeatherBasedOutfitsQuery,
  useGetOutfitStatsQuery,
  useGetAnalyticsQuery,
} = outfitApi;

export default outfitApi;
