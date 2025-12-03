import { api } from "./api";

// Image API slice
export const imageApi = api.injectEndpoints({
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
        return `image/?${queryParams.toString()}`;
      },
      providesTags: ["Image"],
    }),

    // Get single image
    getImage: builder.query({
      query: (id) => `image/${id}`,
      providesTags: (result, error, id) => [{ type: "Image", id }],
    }),

    // Upload image
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: "image/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Image"],
    }),

    // Delete image
    deleteImage: builder.mutation({
      query: (id) => ({
        url: `image/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Image"],
    }),

    // Process image
    processImage: builder.mutation({
      query: (id) => ({
        url: `image/${id}/process`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => ["Image", { type: "Image", id }],
    }),

    // Get image statistics
    getImageStats: builder.query({
      query: () => "image/stats",
      providesTags: ["Image"],
    }),

    // Get images by color
    getImagesByColor: builder.query({
      query: (color) => `image/color/${color}`,
      providesTags: ["Image"],
    }),

    // Get images by style
    getImagesByStyle: builder.query({
      query: (styleTag) => `image/style/${styleTag}`,
      providesTags: ["Image"],
    }),

    // Get image analysis
    getImageAnalysis: builder.query({
      query: (id) => `image/${id}/analysis`,
      providesTags: (result, error, id) => [{ type: "Image", id }],
    }),

    // Get color palette
    getColorPalette: builder.query({
      query: (id) => `image/${id}/colors`,
      providesTags: (result, error, id) => [{ type: "Image", id }],
    }),

    // Get style tags
    getStyleTags: builder.query({
      query: (id) => `image/${id}/style`,
      providesTags: (result, error, id) => [{ type: "Image", id }],
    }),

    // Get thumbnails
    getThumbnails: builder.query({
      query: (id) => `image/${id}/thumbnails`,
      providesTags: (result, error, id) => [{ type: "Image", id }],
    }),

    // Update image tags
    updateTags: builder.mutation({
      query: ({ id, tags }) => ({
        url: `image/${id}/tags`,
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
        url: `image/${id}/privacy`,
        method: "PUT",
        body: { isPublic },
      }),
      invalidatesTags: (result, error, { id }) => [
        "Image",
        { type: "Image", id },
      ],
    }),

    // Bulk operations
    bulkDeleteImages: builder.mutation({
      query: (ids) => ({
        url: "image/bulk/delete",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["Image"],
    }),

    bulkUpdateImages: builder.mutation({
      query: ({ ids, updates }) => ({
        url: "image/bulk/update",
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
  useGetImageStatsQuery,
  useGetImagesByColorQuery,
  useGetImagesByStyleQuery,
  useGetImageAnalysisQuery,
  useGetColorPaletteQuery,
  useGetStyleTagsQuery,
  useGetThumbnailsQuery,
  useUpdateTagsMutation,
  useSetPrivacyMutation,
  useBulkDeleteImagesMutation,
  useBulkUpdateImagesMutation,
} = imageApi;

export default imageApi;
