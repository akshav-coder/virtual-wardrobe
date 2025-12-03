import { api } from "./api";

// Wardrobe API slice
export const wardrobeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get wardrobe items
    getItems: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `wardrobe/?${queryParams.toString()}`;
      },
      providesTags: ["WardrobeItem"],
    }),

    // Get single wardrobe item
    getItem: builder.query({
      query: (id) => `wardrobe/${id}`,
      providesTags: (result, error, id) => [{ type: "WardrobeItem", id }],
    }),

    // Create wardrobe item
    createItem: builder.mutation({
      query: (itemData) => ({
        url: "wardrobe/",
        method: "POST",
        body: itemData,
      }),
      invalidatesTags: ["WardrobeItem"],
    }),

    // Update wardrobe item
    updateItem: builder.mutation({
      query: ({ id, ...itemData }) => ({
        url: `wardrobe/${id}`,
        method: "PUT",
        body: itemData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "WardrobeItem",
        { type: "WardrobeItem", id },
      ],
    }),

    // Delete wardrobe item
    deleteItem: builder.mutation({
      query: (id) => ({
        url: `wardrobe/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WardrobeItem"],
    }),

    // Search wardrobe items
    searchItems: builder.query({
      query: (searchParams) => {
        const queryParams = new URLSearchParams();
        Object.keys(searchParams).forEach((key) => {
          if (searchParams[key] !== undefined && searchParams[key] !== null) {
            queryParams.append(key, searchParams[key]);
          }
        });
        return `wardrobe/search?${queryParams.toString()}`;
      },
      providesTags: ["WardrobeItem"],
    }),

    // Get favorite items
    getFavorites: builder.query({
      query: () => "wardrobe/favorites",
      providesTags: ["WardrobeItem"],
    }),

    // Toggle favorite status
    toggleFavorite: builder.mutation({
      query: (id) => ({
        url: `wardrobe/${id}/favorite`,
        method: "PUT",
      }),
      invalidatesTags: ["WardrobeItem"],
    }),

    // Increment wear count
    incrementWearCount: builder.mutation({
      query: (id) => ({
        url: `wardrobe/${id}/wear`,
        method: "PUT",
      }),
      invalidatesTags: ["WardrobeItem"],
    }),

    // Get recently added items
    getRecentItems: builder.query({
      query: (limit = 10) => `wardrobe/recent?limit=${limit}`,
      providesTags: ["WardrobeItem"],
    }),

    // Get wardrobe statistics
    getWardrobeStats: builder.query({
      query: () => "wardrobe/stats",
      providesTags: ["WardrobeItem"],
    }),

    // Get wardrobe overview
    getOverview: builder.query({
      query: () => "wardrobe/stats/overview",
      providesTags: ["WardrobeItem"],
    }),

    // Bulk operations
    bulkDeleteWardrobeItems: builder.mutation({
      query: (ids) => ({
        url: "wardrobe/bulk/delete",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["WardrobeItem"],
    }),

    bulkUpdateWardrobeItems: builder.mutation({
      query: ({ ids, updates }) => ({
        url: "wardrobe/bulk/update",
        method: "PUT",
        body: { ids, updates },
      }),
      invalidatesTags: ["WardrobeItem"],
    }),
  }),
});

// Export hooks
export const {
  useGetItemsQuery,
  useGetItemQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useSearchItemsQuery,
  useGetFavoritesQuery,
  useToggleFavoriteMutation,
  useIncrementWearCountMutation,
  useGetRecentItemsQuery,
  useGetWardrobeStatsQuery,
  useGetOverviewQuery,
  useBulkDeleteWardrobeItemsMutation,
  useBulkUpdateWardrobeItemsMutation,
} = wardrobeApi;

export default wardrobeApi;
