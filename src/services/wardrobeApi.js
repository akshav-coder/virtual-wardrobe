import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Wardrobe API slice
export const wardrobeApi = createApi({
  reducerPath: "wardrobeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api/wardrobe",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["WardrobeItem"],
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
        return `/?${queryParams.toString()}`;
      },
      providesTags: ["WardrobeItem"],
    }),

    // Get single wardrobe item
    getItem: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "WardrobeItem", id }],
    }),

    // Create wardrobe item
    createItem: builder.mutation({
      query: (itemData) => ({
        url: "/",
        method: "POST",
        body: itemData,
      }),
      invalidatesTags: ["WardrobeItem"],
    }),

    // Update wardrobe item
    updateItem: builder.mutation({
      query: ({ id, ...itemData }) => ({
        url: `/${id}`,
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
        url: `/${id}`,
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
        return `/search?${queryParams.toString()}`;
      },
      providesTags: ["WardrobeItem"],
    }),

    // Get favorite items
    getFavorites: builder.query({
      query: () => "/favorites",
      providesTags: ["WardrobeItem"],
    }),

    // Toggle favorite status
    toggleFavorite: builder.mutation({
      query: (id) => ({
        url: `/${id}/favorite`,
        method: "PUT",
      }),
      invalidatesTags: ["WardrobeItem"],
    }),

    // Increment wear count
    incrementWearCount: builder.mutation({
      query: (id) => ({
        url: `/${id}/wear`,
        method: "PUT",
      }),
      invalidatesTags: ["WardrobeItem"],
    }),

    // Get recently added items
    getRecentItems: builder.query({
      query: (limit = 10) => `/recent?limit=${limit}`,
      providesTags: ["WardrobeItem"],
    }),

    // Get wardrobe statistics
    getStats: builder.query({
      query: () => "/stats",
      providesTags: ["WardrobeItem"],
    }),

    // Get wardrobe overview
    getOverview: builder.query({
      query: () => "/stats/overview",
      providesTags: ["WardrobeItem"],
    }),

    // Bulk operations
    bulkDelete: builder.mutation({
      query: (ids) => ({
        url: "/bulk/delete",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["WardrobeItem"],
    }),

    bulkUpdate: builder.mutation({
      query: ({ ids, updates }) => ({
        url: "/bulk/update",
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
  useGetStatsQuery,
  useGetOverviewQuery,
  useBulkDeleteMutation,
  useBulkUpdateMutation,
} = wardrobeApi;

export default wardrobeApi;
