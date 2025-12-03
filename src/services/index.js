// Main API service
export { default as api, useHealthCheckQuery } from "./api";

// Authentication API
export {
  default as authApi,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from "./authApi";

// User API
export {
  default as userApi,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetUserStatsQuery,
  useUpdateUserPreferencesMutation,
  useUpdateMeasurementsMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useGetDashboardQuery,
} from "./userApi";

// Wardrobe API
export {
  default as wardrobeApi,
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
} from "./wardrobeApi";

// Outfit API
export {
  default as outfitApi,
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
} from "./outfitApi";

// Weather API
export {
  default as weatherApi,
  useSetLocationMutation,
  useGetCurrentWeatherQuery,
  useGetForecastQuery,
  useGetAlertsQuery,
  useGetHistoryQuery,
  useGetWeatherStatsQuery,
  useRefreshWeatherMutation,
  useGetWeatherOutfitRecommendationsQuery,
  useGetWeatherByCoordinatesQuery,
  useGetWeatherByCityQuery,
  useGetWeatherComparisonQuery,
} from "./weatherApi";

// AI API
export {
  default as aiApi,
  useGetRecommendationsQuery,
  useGenerateRecommendationsMutation,
  useAddFeedbackMutation,
  useGetAiStatsQuery,
  useGetStyleAnalysisQuery,
  useGetColorRecommendationsQuery,
  useGetOccasionRecommendationsQuery,
  useGetWeatherRecommendationsQuery,
  useGetPersonalizedRecommendationsQuery,
  useGetRecommendationHistoryQuery,
  useDeleteRecommendationMutation,
  useGetPreferencesQuery,
  useUpdateAiPreferencesMutation,
} from "./aiApi";

// Calendar API
export {
  default as calendarApi,
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetUpcomingEventsQuery,
  useGetTodayEventsQuery,
  useGetEventsByDateQuery,
  useGetCalendarStatsQuery,
  useAssignOutfitMutation,
  useGetCalendarOutfitRecommendationsQuery,
  useAddReminderMutation,
  useRemoveReminderMutation,
  useGetEventsByOccasionQuery,
  useGetEventsByPriorityQuery,
  useGetBusyDaysQuery,
  useBulkDeleteCalendarEventsMutation,
  useBulkUpdateCalendarEventsMutation,
} from "./calendarApi";

// Image API
export {
  default as imageApi,
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
} from "./imageApi";

// Analytics API
export {
  default as analyticsApi,
  useTrackEventMutation,
  useGetAnalyticsEventsQuery,
  useGetAnalyticsDashboardQuery,
  useGetAnalyticsUserStatsQuery,
  useGetEventTypeStatsQuery,
  useGetCategoryStatsQuery,
  useGetDailyActivityQuery,
  useGetHourlyActivityQuery,
  useGetItemStatsQuery,
  useGetSearchStatsQuery,
  useGetRecommendationStatsQuery,
  useGetWardrobeInsightsQuery,
  useGetBehaviorPatternsQuery,
  useGetPerformanceMetricsQuery,
  useExportAnalyticsMutation,
} from "./analyticsApi";
