import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Calendar API slice
export const calendarApi = createApi({
  reducerPath: "calendarApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.74.215.78:3001/api/calendar",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["CalendarEvent"],
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
        return `/?${queryParams.toString()}`;
      },
      providesTags: ["CalendarEvent"],
    }),

    // Get single event
    getEvent: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "CalendarEvent", id }],
    }),

    // Create event
    createEvent: builder.mutation({
      query: (eventData) => ({
        url: "/",
        method: "POST",
        body: eventData,
      }),
      invalidatesTags: ["CalendarEvent"],
    }),

    // Update event
    updateEvent: builder.mutation({
      query: ({ id, ...eventData }) => ({
        url: `/${id}`,
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
        url: `/${id}`,
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
        return `/upcoming?${queryParams.toString()}`;
      },
      providesTags: ["CalendarEvent"],
    }),

    // Get today's events
    getTodayEvents: builder.query({
      query: () => "/today",
      providesTags: ["CalendarEvent"],
    }),

    // Get events by date
    getEventsByDate: builder.query({
      query: (date) => `/date/${date}`,
      providesTags: ["CalendarEvent"],
    }),

    // Get calendar statistics
    getStats: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });
        return `/stats?${queryParams.toString()}`;
      },
      providesTags: ["CalendarEvent"],
    }),

    // Assign outfit to event
    assignOutfit: builder.mutation({
      query: ({ id, outfitId }) => ({
        url: `/${id}/outfit`,
        method: "PUT",
        body: { outfitId },
      }),
      invalidatesTags: (result, error, { id }) => [
        "CalendarEvent",
        { type: "CalendarEvent", id },
      ],
    }),

    // Get outfit recommendations for event
    getOutfitRecommendations: builder.query({
      query: (id) => `/${id}/recommendations`,
      providesTags: ["CalendarEvent"],
    }),

    // Add reminder to event
    addReminder: builder.mutation({
      query: ({ id, reminder }) => ({
        url: `/${id}/reminders/add`,
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
        url: `/${id}/reminders/remove`,
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
      query: (occasion) => `/occasion/${occasion}`,
      providesTags: ["CalendarEvent"],
    }),

    // Get events by priority
    getEventsByPriority: builder.query({
      query: (priority) => `/priority/${priority}`,
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
        return `/busy-days?${queryParams.toString()}`;
      },
      providesTags: ["CalendarEvent"],
    }),

    // Bulk operations
    bulkDelete: builder.mutation({
      query: (ids) => ({
        url: "/bulk/delete",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["CalendarEvent"],
    }),

    bulkUpdate: builder.mutation({
      query: ({ ids, updates }) => ({
        url: "/bulk/update",
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
  useGetStatsQuery,
  useAssignOutfitMutation,
  useGetOutfitRecommendationsQuery,
  useAddReminderMutation,
  useRemoveReminderMutation,
  useGetEventsByOccasionQuery,
  useGetEventsByPriorityQuery,
  useGetBusyDaysQuery,
  useBulkDeleteMutation,
  useBulkUpdateMutation,
} = calendarApi;

export default calendarApi;
