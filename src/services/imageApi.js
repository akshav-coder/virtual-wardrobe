import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Image API slice
export const imageApi = createApi({
  reducerPath: "imageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.74.215.78:3001/api/image",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      // Don't set Content-Type for file uploads
      return headers;
    },
  }),
  tagTypes: ["Image"],
  endpoints: (builder) => ({
    // Get user images
    getImages: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/?${queryParams.toString()}`;
      },
      providesTags: ["Image"],
    }),

    // Get single image
    getImage: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Image", id }],
    }),

    // Upload image
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: "/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Image"],
    }),

    // Delete image
    deleteImage: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Image"],
    }),

    // Process image
    processImage: builder.mutation({
      query: (id) => ({
        url: `/${id}/process`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => ["Image", { type: "Image", id }],
    }),

    // Get image statistics
    getStats: builder.query({
      query: () => "/stats",
      providesTags: ["Image"],
    }),

    // Get images by color
    getImagesByColor: builder.query({
      query: (color) => `/color/${color}`,
      providesTags: ["Image"],
    }),

    // Get images by style
    getImagesByStyle: builder.query({
      query: (styleTag) => `/style/${styleTag}`,
      providesTags: ["Image"],
    }),

    // Get image analysis
    getImageAnalysis: builder.query({
      query: (id) => `/${id}/analysis`,
      providesTags: (result, error, id) => [{ type: "Image", id }],
    }),

    // Get color palette
    getColorPalette: builder.query({
      query: (id) => `/${id}/colors`,
      providesTags: (result, error, id) => [{ type: "Image", id }],
    }),

    // Get style tags
    getStyleTags: builder.query({
      query: (id) => `/${id}/style`,
      providesTags: (result, error, id) => [{ type: "Image", id }],
    }),

    // Get thumbnails
    getThumbnails: builder.query({
      query: (id) => `/${id}/thumbnails`,
      providesTags: (result, error, id) => [{ type: "Image", id }],
    }),

    // Update image tags
    updateTags: builder.mutation({
      query: ({ id, tags }) => ({
        url: `/${id}/tags`,
        method: "PUT",
        body: { tags },
      }),
      invalidatesTags: (result, error, { id }) => [
        "Image",
        { type: "Image", id },
      ],
    }),

    // Set image privacy
    setPrivacy: builder.mutation({
      query: ({ id, isPublic }) => ({
        url: `/${id}/privacy`,
        method: "PUT",
        body: { isPublic },
      }),
      invalidatesTags: (result, error, { id }) => [
        "Image",
        { type: "Image", id },
      ],
    }),

    // Bulk operations
    bulkDelete: builder.mutation({
      query: (ids) => ({
        url: "/bulk/delete",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["Image"],
    }),

    bulkUpdate: builder.mutation({
      query: ({ ids, updates }) => ({
        url: "/bulk/update",
        method: "PUT",
        body: { ids, updates },
      }),
      invalidatesTags: ["Image"],
    }),
  }),
});

// Export hooks
export const {
  useGetImagesQuery,
  useGetImageQuery,
  useUploadImageMutation,
  useDeleteImageMutation,
  useProcessImageMutation,
  useGetStatsQuery,
  useGetImagesByColorQuery,
  useGetImagesByStyleQuery,
  useGetImageAnalysisQuery,
  useGetColorPaletteQuery,
  useGetStyleTagsQuery,
  useGetThumbnailsQuery,
  useUpdateTagsMutation,
  useSetPrivacyMutation,
  useBulkDeleteMutation,
  useBulkUpdateMutation,
} = imageApi;

export default imageApi;
