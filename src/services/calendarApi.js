import { api } from "./api";

// Calendar API slice
export const calendarApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get calendar events
    getEvents: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `calendar/?${queryParams.toString()}`;
      },
      providesTags: ["CalendarEvent"],
    }),

    // Get single event
    getEvent: builder.query({
      query: (id) => `calendar/${id}`,
      providesTags: (result, error, id) => [{ type: "CalendarEvent", id }],
    }),

    // Create event
    createEvent: builder.mutation({
      query: (eventData) => ({
        url: "calendar/",
        method: "POST",
        body: eventData,
      }),
      invalidatesTags: ["CalendarEvent"],
    }),

    // Update event
    updateEvent: builder.mutation({
      query: ({ id, ...eventData }) => ({
        url: `calendar/${id}`,
        method: "PUT",
        body: eventData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "CalendarEvent",
        { type: "CalendarEvent", id },
      ],
    }),

    // Delete event
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `calendar/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CalendarEvent"],
    }),

    // Get upcoming events
    getUpcomingEvents: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `calendar/upcoming?${queryParams.toString()}`;
      },
      providesTags: ["CalendarEvent"],
    }),

    // Get today's events
    getTodayEvents: builder.query({
      query: () => "calendar/today",
      providesTags: ["CalendarEvent"],
    }),

    // Get events by date
    getEventsByDate: builder.query({
      query: (date) => `calendar/date/${date}`,
      providesTags: ["CalendarEvent"],
    }),

    // Get calendar statistics
    getCalendarStats: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `calendar/stats?${queryParams.toString()}`;
      },
      providesTags: ["CalendarEvent"],
    }),

    // Assign outfit to event
    assignOutfit: builder.mutation({
      query: ({ id, outfitId }) => ({
        url: `calendar/${id}/outfit`,
        method: "PUT",
        body: { outfitId },
      }),
      invalidatesTags: (result, error, { id }) => [
        "CalendarEvent",
        { type: "CalendarEvent", id },
      ],
    }),

    // Get outfit recommendations for event
    getCalendarOutfitRecommendations: builder.query({
      query: (id) => `calendar/${id}/recommendations`,
      providesTags: ["CalendarEvent"],
    }),

    // Add reminder to event
    addReminder: builder.mutation({
      query: ({ id, reminder }) => ({
        url: `calendar/${id}/reminders/add`,
        method: "PUT",
        body: reminder,
      }),
      invalidatesTags: (result, error, { id }) => [
        "CalendarEvent",
        { type: "CalendarEvent", id },
      ],
    }),

    // Remove reminder from event
    removeReminder: builder.mutation({
      query: ({ id, reminder }) => ({
        url: `calendar/${id}/reminders/remove`,
        method: "PUT",
        body: reminder,
      }),
      invalidatesTags: (result, error, { id }) => [
        "CalendarEvent",
        { type: "CalendarEvent", id },
      ],
    }),

    // Get events by occasion
    getEventsByOccasion: builder.query({
      query: (occasion) => `calendar/occasion/${occasion}`,
      providesTags: ["CalendarEvent"],
    }),

    // Get events by priority
    getEventsByPriority: builder.query({
      query: (priority) => `calendar/priority/${priority}`,
      providesTags: ["CalendarEvent"],
    }),

    // Get busy days
    getBusyDays: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `calendar/busy-days?${queryParams.toString()}`;
      },
      providesTags: ["CalendarEvent"],
    }),

    // Bulk operations
    bulkDeleteCalendarEvents: builder.mutation({
      query: (ids) => ({
        url: "calendar/bulk/delete",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["CalendarEvent"],
    }),

    bulkUpdateCalendarEvents: builder.mutation({
      query: ({ ids, updates }) => ({
        url: "calendar/bulk/update",
        method: "PUT",
        body: { ids, updates },
      }),
      invalidatesTags: ["CalendarEvent"],
    }),
  }),
});

// Export hooks
export const {
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
} = calendarApi;

export default calendarApi;
