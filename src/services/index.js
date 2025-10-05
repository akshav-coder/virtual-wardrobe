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
  useGetStatsQuery,
  useUpdatePreferencesMutation,
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
  useGetStatsQuery as useGetWardrobeStatsQuery,
  useGetOverviewQuery,
  useBulkDeleteMutation,
  useBulkUpdateMutation,
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
  useUpdateItemMutation as useUpdateOutfitItemMutation,
  useSearchOutfitsQuery,
  useGetFavoritesQuery as useGetFavoriteOutfitsQuery,
  useToggleFavoriteMutation as useToggleOutfitFavoriteMutation,
  useIncrementWearCountMutation as useIncrementOutfitWearCountMutation,
  useGetTemplatesQuery,
  useCreateFromTemplateMutation,
  useGetScheduledOutfitsQuery,
  useScheduleOutfitMutation,
  useGetWeatherBasedOutfitsQuery,
  useGetStatsQuery as useGetOutfitStatsQuery,
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
  useGetStatsQuery as useGetWeatherStatsQuery,
  useRefreshWeatherMutation,
  useGetOutfitRecommendationsQuery,
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
  useGetStatsQuery as useGetAIStatsQuery,
  useGetStyleAnalysisQuery,
  useGetColorRecommendationsQuery,
  useGetOccasionRecommendationsQuery,
  useGetWeatherRecommendationsQuery,
  useGetPersonalizedRecommendationsQuery,
  useGetRecommendationHistoryQuery,
  useDeleteRecommendationMutation,
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
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
  useGetStatsQuery as useGetCalendarStatsQuery,
  useAssignOutfitMutation,
  useGetOutfitRecommendationsQuery as useGetCalendarOutfitRecommendationsQuery,
  useAddReminderMutation,
  useRemoveReminderMutation,
  useGetEventsByOccasionQuery,
  useGetEventsByPriorityQuery,
  useGetBusyDaysQuery,
  useBulkDeleteMutation as useBulkDeleteCalendarMutation,
  useBulkUpdateMutation as useBulkUpdateCalendarMutation,
} from "./calendarApi";

// Image API
export {
  default as imageApi,
  useGetImagesQuery,
  useGetImageQuery,
  useUploadImageMutation,
  useDeleteImageMutation,
  useProcessImageMutation,
  useGetStatsQuery as useGetImageStatsQuery,
  useGetImagesByColorQuery,
  useGetImagesByStyleQuery,
  useGetImageAnalysisQuery,
  useGetColorPaletteQuery,
  useGetStyleTagsQuery,
  useGetThumbnailsQuery,
  useUpdateTagsMutation,
  useSetPrivacyMutation,
  useBulkDeleteMutation as useBulkDeleteImageMutation,
  useBulkUpdateMutation as useBulkUpdateImageMutation,
} from "./imageApi";

// Analytics API
export {
  default as analyticsApi,
  useTrackEventMutation,
  useGetEventsQuery as useGetAnalyticsEventsQuery,
  useGetDashboardQuery,
  useGetUserStatsQuery,
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
