import { api } from "./api";

// User API slice
export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get user profile
    getProfile: builder.query({
      query: () => "user/profile",
      providesTags: ["User"],
    }),

    // Update user profile
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "user/profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["User"],
    }),

    // Get user statistics
    getUserStats: builder.query({
      query: () => "user/stats",
      providesTags: ["User"],
    }),

    // Update user preferences
    updateUserPreferences: builder.mutation({
      query: (preferences) => ({
        url: "user/preferences",
        method: "PUT",
        body: preferences,
      }),
      invalidatesTags: ["User"],
    }),

    // Update body measurements
    updateMeasurements: builder.mutation({
      query: (measurements) => ({
        url: "user/measurements",
        method: "PUT",
        body: measurements,
      }),
      invalidatesTags: ["User"],
    }),

    // Change password
    changePassword: builder.mutation({
      query: ({ currentPassword, newPassword }) => ({
        url: "user/password",
        method: "PUT",
        body: { currentPassword, newPassword },
      }),
    }),

    // Delete user account
    deleteAccount: builder.mutation({
      query: (password) => ({
        url: "user/delete",
        method: "DELETE",
        body: { password },
      }),
      invalidatesTags: ["User"],
    }),

    // Get user dashboard data
    getDashboard: builder.query({
      query: () => "user/dashboard",
      providesTags: ["User"],
    }),
  }),
});

// Export hooks
export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetUserStatsQuery,
  useUpdateUserPreferencesMutation,
  useUpdateMeasurementsMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useGetDashboardQuery,
} = userApi;

export default userApi;
