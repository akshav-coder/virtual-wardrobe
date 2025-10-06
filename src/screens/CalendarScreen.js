import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Surface,
  Text,
  FAB,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import {
  useGetEventsQuery,
  useGetUpcomingEventsQuery,
  useGetTodayEventsQuery,
  useGetOutfitsQuery,
  useGetCalendarStatsQuery,
} from "../services";
import { showErrorMessage, showSuccessMessage } from "../utils/apiUtils";

const { width } = Dimensions.get("window");

const CalendarScreen = ({ navigation }) => {
  const auth = useSelector((state) => state.auth);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("week"); // 'week' or 'month'
  const [refreshing, setRefreshing] = useState(false);

  // API hooks
  const {
    data: events = [],
    isLoading: isLoadingEvents,
    error: eventsError,
    refetch: refetchEvents,
  } = useGetEventsQuery(undefined, {
    skip: !auth.isAuthenticated,
  });

  const {
    data: upcomingEvents = [],
    isLoading: isLoadingUpcoming,
    refetch: refetchUpcoming,
  } = useGetUpcomingEventsQuery(undefined, {
    skip: !auth.isAuthenticated,
  });

  const {
    data: todayEvents = [],
    isLoading: isLoadingToday,
    refetch: refetchToday,
  } = useGetTodayEventsQuery(undefined, {
    skip: !auth.isAuthenticated,
  });

  const {
    data: outfits = [],
    isLoading: isLoadingOutfits,
    refetch: refetchOutfits,
  } = useGetOutfitsQuery(undefined, {
    skip: !auth.isAuthenticated,
  });

  const {
    data: calendarStats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useGetCalendarStatsQuery(undefined, {
    skip: !auth.isAuthenticated,
  });

  const isLoading =
    isLoadingEvents ||
    isLoadingUpcoming ||
    isLoadingToday ||
    isLoadingOutfits ||
    isLoadingStats;

  // Refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchEvents(),
        refetchUpcoming(),
        refetchToday(),
        refetchOutfits(),
        refetchStats(),
      ]);
      showSuccessMessage("Calendar data refreshed");
    } catch (error) {
      showErrorMessage("Failed to refresh calendar data");
    } finally {
      setRefreshing(false);
    }
  };

  const generateCalendarData = () => {
    const today = new Date();
    const currentWeek = [];

    // Generate 7 days starting from Monday
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      // Filter outfits for this date
      const dayOutfits = outfits.filter((outfit) => {
        const outfitDate = new Date(outfit.createdAt);
        return outfitDate.toDateString() === date.toDateString();
      });

      // Filter events for this date
      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.startDate);
        return eventDate.toDateString() === date.toDateString();
      });

      currentWeek.push({
        date,
        outfits: dayOutfits,
        events: dayEvents,
        isToday: date.toDateString() === today.toDateString(),
        isPast: date < today,
      });
    }

    return currentWeek;
  };

  const calendarData = generateCalendarData();

  const DayCard = ({ dayData }) => (
    <TouchableOpacity
      style={[
        styles.dayCard,
        dayData.isToday && styles.todayCard,
        dayData.isPast && styles.pastCard,
      ]}
      onPress={() => {
        /* Navigate to day detail */
      }}
    >
      <View style={styles.dayHeader}>
        <Text style={[styles.dayName, dayData.isToday && styles.todayText]}>
          {dayData.date.toLocaleDateString("en", { weekday: "short" })}
        </Text>
        <Text style={[styles.dayNumber, dayData.isToday && styles.todayText]}>
          {dayData.date.getDate()}
        </Text>
      </View>

      <View style={styles.dayOutfits}>
        {dayData.outfits.length > 0 ? (
          dayData.outfits.slice(0, 2).map((outfit, index) => (
            <View key={index} style={styles.outfitPreview}>
              <Image
                source={{
                  uri:
                    outfit.items?.[0]?.image ||
                    outfit.items?.[0]?.imageUrl ||
                    "https://via.placeholder.com/40",
                }}
                style={styles.outfitImage}
              />
              <Text style={styles.outfitName} numberOfLines={1}>
                {outfit.name}
              </Text>
            </View>
          ))
        ) : dayData.events.length > 0 ? (
          dayData.events.slice(0, 2).map((event, index) => (
            <View key={index} style={styles.eventPreview}>
              <Ionicons name="calendar" size={16} color="#6366f1" />
              <Text style={styles.eventName} numberOfLines={1}>
                {event.title}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.noOutfit}>
            <Ionicons name="add" size={20} color="#9ca3af" />
            <Text style={styles.noOutfitText}>Add outfit</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const WeekView = () => (
    <View style={styles.weekContainer}>
      <Text style={styles.sectionTitle}>This Week</Text>
      <View style={styles.weekGrid}>
        {calendarData.map((dayData, index) => (
          <DayCard key={index} dayData={dayData} />
        ))}
      </View>
    </View>
  );

  const UpcomingEvents = () => {
    // Use API events if available, otherwise fallback to demo data
    const displayEvents =
      upcomingEvents.length > 0
        ? upcomingEvents
        : [
            {
              id: "1",
              title: "Team Meeting",
              startDate: new Date(
                Date.now() + 24 * 60 * 60 * 1000
              ).toISOString(),
              occasion: "business",
              outfitSuggestion: "Business Casual",
            },
            {
              id: "2",
              title: "Dinner Date",
              startDate: new Date(
                Date.now() + 4 * 24 * 60 * 60 * 1000
              ).toISOString(),
              occasion: "casual",
              outfitSuggestion: "Smart Casual",
            },
            {
              id: "3",
              title: "Weekend Trip",
              startDate: new Date(
                Date.now() + 5 * 24 * 60 * 60 * 1000
              ).toISOString(),
              occasion: "travel",
              outfitSuggestion: "Travel Comfort",
            },
          ];

    const getEventIcon = (occasion) => {
      switch (occasion) {
        case "business":
          return "briefcase";
        case "casual":
          return "restaurant";
        case "travel":
          return "airplane";
        default:
          return "calendar";
      }
    };

    const getEventIconColor = (occasion) => {
      switch (occasion) {
        case "business":
          return "#6366f1";
        case "casual":
          return "#10b981";
        case "travel":
          return "#f59e0b";
        default:
          return "#6b7280";
      }
    };

    return (
      <Card style={styles.eventsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Upcoming Events</Title>
          <View style={styles.eventsList}>
            {displayEvents.slice(0, 3).map((event, index) => (
              <View key={event.id || index} style={styles.eventItem}>
                <View style={styles.eventIcon}>
                  <Ionicons
                    name={getEventIcon(event.occasion)}
                    size={20}
                    color={getEventIconColor(event.occasion)}
                  />
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventTime}>
                    {new Date(event.startDate).toLocaleDateString("en", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </Text>
                  <Text style={styles.eventOutfit}>
                    Suggested: {event.outfitSuggestion || "Casual"}
                  </Text>
                </View>
                <Button mode="outlined" compact>
                  Plan
                </Button>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const RecentOutfits = () => (
    <Card style={styles.recentCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Recent Outfits</Title>
        <View style={styles.recentOutfits}>
          {outfits.slice(0, 3).map((outfit, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentOutfit}
              onPress={() => navigation.navigate("OutfitDetail", { outfit })}
            >
              <View style={styles.recentOutfitImages}>
                {outfit.items?.slice(0, 3).map((item, itemIndex) => (
                  <Image
                    key={itemIndex}
                    source={{ uri: item.image || item.imageUrl }}
                    style={styles.recentOutfitImage}
                  />
                ))}
              </View>
              <View style={styles.recentOutfitInfo}>
                <Text style={styles.recentOutfitName}>{outfit.name}</Text>
                <Text style={styles.recentOutfitDate}>
                  {new Date(outfit.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const QuickStats = () => (
    <View style={styles.statsContainer}>
      <Surface style={styles.statCard}>
        <Ionicons name="calendar" size={24} color="#6366f1" />
        <Text style={styles.statNumber}>
          {calendarStats?.totalEvents || events.length || 7}
        </Text>
        <Text style={styles.statLabel}>Events Planned</Text>
      </Surface>
      <Surface style={styles.statCard}>
        <Ionicons name="shirt" size={24} color="#10b981" />
        <Text style={styles.statNumber}>
          {calendarStats?.totalOutfits || outfits.length || 0}
        </Text>
        <Text style={styles.statLabel}>Total Outfits</Text>
      </Surface>
      <Surface style={styles.statCard}>
        <Ionicons name="trending-up" size={24} color="#f59e0b" />
        <Text style={styles.statNumber}>
          {calendarStats?.styleScore || "85%"}
        </Text>
        <Text style={styles.statLabel}>Style Score</Text>
      </Surface>
    </View>
  );

  // Show loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading calendar data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <WeekView />
        <QuickStats />
        <UpcomingEvents />
        <RecentOutfits />
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("Main", { screen: "Planner" })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  weekContainer: {
    marginBottom: 24,
  },
  weekGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayCard: {
    flex: 1,
    marginHorizontal: 2,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
    elevation: 2,
    minHeight: 120,
  },
  todayCard: {
    backgroundColor: "#e0e7ff",
    borderWidth: 2,
    borderColor: "#6366f1",
  },
  pastCard: {
    opacity: 0.6,
  },
  dayHeader: {
    alignItems: "center",
    marginBottom: 8,
  },
  dayName: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  todayText: {
    color: "#6366f1",
  },
  dayOutfits: {
    flex: 1,
  },
  outfitPreview: {
    alignItems: "center",
    marginBottom: 8,
  },
  outfitImage: {
    width: 30,
    height: 30,
    borderRadius: 6,
    marginBottom: 4,
  },
  outfitName: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
  },
  noOutfit: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  noOutfitText: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 4,
  },
  eventPreview: {
    alignItems: "center",
    marginBottom: 8,
  },
  eventName: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },
  eventsCard: {
    marginBottom: 24,
    elevation: 2,
  },
  eventsList: {
    marginTop: 8,
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  eventTime: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  eventOutfit: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  recentCard: {
    marginBottom: 24,
    elevation: 2,
  },
  recentOutfits: {
    marginTop: 8,
  },
  recentOutfit: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  recentOutfitImages: {
    flexDirection: "row",
    marginRight: 12,
  },
  recentOutfitImage: {
    width: 30,
    height: 30,
    borderRadius: 6,
    marginRight: 4,
  },
  recentOutfitInfo: {
    flex: 1,
  },
  recentOutfitName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
  },
  recentOutfitDate: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#6366f1",
  },
});

export default CalendarScreen;
