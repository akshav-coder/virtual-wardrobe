import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// User API slice
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api/user",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Get user profile
    getProfile: builder.query({
      query: () => "/profile",
      providesTags: ["User"],
    }),

    // Update user profile
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "/profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["User"],
    }),

    // Get user statistics
    getStats: builder.query({
      query: () => "/stats",
      providesTags: ["User"],
    }),

    // Update user preferences
    updatePreferences: builder.mutation({
      query: (preferences) => ({
        url: "/preferences",
        method: "PUT",
        body: preferences,
      }),
      invalidatesTags: ["User"],
    }),

    // Update body measurements
    updateMeasurements: builder.mutation({
      query: (measurements) => ({
        url: "/measurements",
        method: "PUT",
        body: measurements,
      }),
      invalidatesTags: ["User"],
    }),

    // Change password
    changePassword: builder.mutation({
      query: ({ currentPassword, newPassword }) => ({
        url: "/password",
        method: "PUT",
        body: { currentPassword, newPassword },
      }),
    }),

    // Delete user account
    deleteAccount: builder.mutation({
      query: (password) => ({
        url: "/delete",
        method: "DELETE",
        body: { password },
      }),
      invalidatesTags: ["User"],
    }),

    // Get user dashboard data
    getDashboard: builder.query({
      query: () => "/dashboard",
      providesTags: ["User"],
    }),
  }),
});

// Export hooks
export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetStatsQuery,
  useUpdatePreferencesMutation,
  useUpdateMeasurementsMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useGetDashboardQuery,
} = userApi;

export default userApi;
