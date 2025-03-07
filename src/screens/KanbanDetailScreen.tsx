"use client";

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
} from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Chip,
  List,
  Portal,
  Dialog,
  Button,
  Provider as PaperProvider,
} from "react-native-paper";
import { useRoute, RouteProp } from "@react-navigation/native";
import {
  findSchedule,
  type JobOrder,
  type ScheduleDetails,
} from "../services/api";
import { sendLocationApi } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useOrganization } from "../context/OrganizationContext";
import * as TaskManager from "expo-task-manager";

const { width } = Dimensions.get("window");

// Status styling
const statusColors = {
  todo: "#ef4444",
  inprogress: "#eab308",
  completed: "#22c55e",
  unscheduled: "#6b7280",
};

const statusLabels = {
  todo: "To Do",
  inprogress: "In Progress",
  completed: "Completed",
  unscheduled: "Unscheduled",
};

type OrderStatus = "todo" | "inprogress" | "completed" | "unscheduled";

// Define the type for route params
type RouteParams = {
  KanbanDetailScreen: {
    scheduleId: string;
  };
};

const LOCATION_TRACKING = "location-tracking";

export default function KanbanBoard() {
  const [expandedAccordions, setExpandedAccordions] = useState<
    Record<string, boolean>
  >({});
  const [schedule, setSchedule] = useState<ScheduleDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const [locationDialogVisible, setLocationDialogVisible] = useState(false);
  const [employee, setEmployee] = useState<any>(null);
  const route = useRoute<RouteProp<RouteParams, "KanbanDetailScreen">>();
  const scheduleId = route.params.scheduleId;
  const { user } = useAuth();
  const org = useOrganization();

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const locationUpdateInterval = useRef<NodeJS.Timeout | null>(null);

  // Define the background task
  TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      const { locations } = data as { locations: Location.LocationObject[] };
      const location = locations[0];

      try {
        await sendLocationApi({
          userId: user.id,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          scheduleId: scheduleId,
          orgId: org.selectedOrganization!.id,
        });
      } catch (err) {
        console.error("Error sending location:", err);
      }
    }
  });

  // Start pulse animation for tracking button
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Start slide in animation for cards
  const startSlideAnimation = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.back(1.5)),
      useNativeDriver: true,
    }).start();
  };

  // Start fade in animation
  const startFadeAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (isTracking) {
      startPulseAnimation();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isTracking]);

  useEffect(() => {
    if (!loading && schedule) {
      startSlideAnimation();
      startFadeAnimation();
    }
  }, [loading, schedule]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeData = await AsyncStorage.getItem("employee");

        if (!employeeData) {
          console.error("Employee not found in AsyncStorage");
          return;
        }

        const employeeObj = JSON.parse(employeeData);
        setEmployee(employeeObj);

        try {
          setLoading(true);
          const response = await findSchedule(scheduleId, employeeObj.id);

          // Sort job orders by scheduledOrder if it exists
          const sortedJobOrders = response.jobOrder.sort(
            (a, b) => (a.scheduledOrder || 0) - (b.scheduledOrder || 0)
          );

          setSchedule({
            ...response,
            jobOrder: sortedJobOrders,
          });
        } catch (error) {
          console.error("Error loading schedule:", error);
        } finally {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error parsing employee data:", error);
      }
    };

    fetchData();

    // Clean up location tracking on unmount
    return () => {
      if (locationUpdateInterval.current) {
        clearInterval(locationUpdateInterval.current);
      }
    };
  }, [scheduleId]);

  const toggleAccordion = (id: string) => {
    setExpandedAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const startLocationTracking = async () => {
    if (isTracking) {
      await Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
      setIsTracking(false);
      return;
    }

    try {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Background location permission is required"
        );
        return;
      }

      await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5 * 60 * 1000, // 5 minutes
        distanceInterval: 100, // meters
        foregroundService: {
          notificationTitle: "Location Tracking",
          notificationBody: "Tracking your location for schedule",
        },
      });

      setIsTracking(true);
    } catch (error) {
      console.error("Error starting location tracking:", error);
      Alert.alert("Error", "Unable to start location tracking");
    }
  };

  if (loading) {
    return (
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0891b2" />
            <Text style={styles.loadingText}>Loading schedule...</Text>
          </View>
        </SafeAreaView>
      </PaperProvider>
    );
  }

  if (!schedule) {
    return (
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="calendar-alert"
              size={64}
              color="#94a3b8"
            />
            <Text style={styles.emptyText}>No schedule found</Text>
            <Text style={styles.emptySubtext}>
              The requested schedule could not be loaded
            </Text>
          </View>
        </SafeAreaView>
      </PaperProvider>
    );
  }

  const renderJobOrderCard = ({
    item,
    index,
  }: {
    item: JobOrder;
    index: number;
  }) => {
    // Calculate staggered animation delay based on index
    const animationDelay = index * 100;

    return (
      <Animated.View
        style={[
          {
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [-100, 0],
                  outputRange: [-100, 0],
                }),
              },
            ],
            opacity: fadeAnim,
          },
          { marginBottom: 12 },
        ]}
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Title style={styles.cardTitle}>
                  Order #{item.orderNumber}
                </Title>
                <Chip
                  mode="outlined"
                  textStyle={{
                    color: statusColors[item.status],
                    fontWeight: "bold",
                  }}
                  style={[
                    styles.statusChip,
                    { borderColor: statusColors[item.status], height: 28 },
                  ]}
                >
                  {statusLabels[item.status]}
                </Chip>
              </View>

              <Paragraph style={styles.cardAddress}>{item.address}</Paragraph>
              <View style={styles.cardMetaContainer}>
                <View style={styles.cardMetaItem}>
                  <MaterialCommunityIcons
                    name="package-variant"
                    size={16}
                    color="#6b7280"
                  />
                  <Text style={styles.cardMetaText}>
                    Space: {item.spaceRequried}
                  </Text>
                </View>
                {item.JobOrderTask && (
                  <View style={styles.cardMetaItem}>
                    <MaterialCommunityIcons
                      name="clipboard-list"
                      size={16}
                      color="#6b7280"
                    />
                    <Text style={styles.cardMetaText}>
                      Tasks: {item.JobOrderTask.length}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <List.Accordion
              title="View Tasks"
              titleStyle={styles.accordionTitle}
              style={styles.accordion}
              expanded={expandedAccordions[item.id] || false}
              onPress={() => toggleAccordion(item.id)}
              left={(props) => (
                <List.Icon {...props} icon="clipboard-list-outline" />
              )}
            >
              {item.JobOrderTask &&
                item.JobOrderTask.map((jobOrderTask) => (
                  <List.Item
                    key={jobOrderTask.id}
                    title={jobOrderTask.task.task}
                    description={`Quantity: ${jobOrderTask.quantity} • ${jobOrderTask.task.requiredTimeValue} ${jobOrderTask.task.requiredTimeUnit}`}
                    titleStyle={styles.taskTitle}
                    descriptionStyle={styles.taskDescription}
                    left={(props) => (
                      <View style={styles.taskIconContainer}>
                        <MaterialCommunityIcons
                          name="circle-medium"
                          size={24}
                          color="#0891b2"
                        />
                      </View>
                    )}
                  />
                ))}
            </List.Accordion>
          </Card.Content>
        </Card>
      </Animated.View>
    );
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Schedule</Text>
          <TouchableOpacity
            style={[
              styles.trackingButton,
              isTracking ? styles.trackingActive : styles.trackingInactive,
            ]}
            onPress={() => setLocationDialogVisible(true)}
          >
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <MaterialCommunityIcons
                name={isTracking ? "map-marker-check" : "map-marker-off"}
                size={20}
                color="white"
              />
            </Animated.View>
            <Text style={styles.trackingButtonText}>
              {isTracking ? "Tracking" : "Not Tracking"}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={schedule.jobOrder}
          keyExtractor={(item) => item.id}
          renderItem={renderJobOrderCard}
          contentContainerStyle={styles.columnContent}
          ListEmptyComponent={
            <View style={styles.emptyListContainer}>
              <MaterialCommunityIcons
                name="clipboard-text-off"
                size={64}
                color="#94a3b8"
              />
              <Text style={styles.emptyColumnText}>No job orders assigned</Text>
            </View>
          }
        />

        <Portal>
          <Dialog
            visible={locationDialogVisible}
            onDismiss={() => setLocationDialogVisible(false)}
            style={styles.dialog}
          >
            <Dialog.Title style={styles.dialogTitle}>
              {isTracking
                ? "Stop Location Tracking?"
                : "Start Location Tracking?"}
            </Dialog.Title>
            <Dialog.Content>
              <Text style={styles.dialogContent}>
                {isTracking
                  ? "Your location will no longer be shared with your organization."
                  : "Your location will be periodically shared with your organization while you're on this job. This helps coordinate work and improve scheduling."}
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setLocationDialogVisible(false)}>
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={startLocationTracking}
                style={isTracking ? styles.stopButton : styles.startButton}
              >
                {isTracking ? "Stop Tracking" : "Start Tracking"}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
  },
  trackingButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  trackingActive: {
    backgroundColor: "#22c55e",
  },
  trackingInactive: {
    backgroundColor: "#ef4444",
  },
  trackingButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  columnContent: {
    padding: 16,
    paddingBottom: 120,
  },
  card: {
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "white",
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  statusChip: {
    height: 28,
  },
  cardAddress: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 8,
  },
  cardMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  cardMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardMetaText: {
    fontSize: 13,
    color: "#64748b",
  },
  accordion: {
    padding: 0,
    backgroundColor: "#f8fafc",
    marginTop: 8,
    borderRadius: 8,
  },
  accordionTitle: {
    fontSize: 14,
    color: "#0891b2",
    fontWeight: "600",
  },
  taskTitle: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "500",
  },
  taskDescription: {
    fontSize: 12,
    color: "#64748b",
  },
  taskIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#64748b",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 8,
    textAlign: "center",
  },
  emptyListContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyColumnText: {
    textAlign: "center",
    color: "#94a3b8",
    marginTop: 16,
    fontSize: 16,
  },
  dialog: {
    backgroundColor: "white",
    borderRadius: 12,
  },
  dialogTitle: {
    color: "#0f172a",
    fontSize: 18,
  },
  dialogContent: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: "#0891b2",
  },
  stopButton: {
    backgroundColor: "#ef4444",
  },
});
