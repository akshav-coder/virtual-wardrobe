import { api } from "./api";

// Auth API slice
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Register user
    register: builder.mutation({
      query: (credentials) => ({
        url: "auth/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Login user
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Logout user
    logout: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    // Forgot password
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    // Reset password
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: "auth/reset-password",
        method: "POST",
        body: { token, password },
      }),
    }),

    // Verify email
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: "auth/verify-email",
        method: "POST",
        body: { token },
      }),
    }),

    // Resend verification email
    resendVerification: builder.mutation({
      query: (email) => ({
        url: "auth/resend-verification",
        method: "POST",
        body: { email },
      }),
    }),
  }),
});

// Export hooks
export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} = authApi;

export default authApi;
