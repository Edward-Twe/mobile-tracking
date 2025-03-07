"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, Alert, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import { useAuth } from "../context/AuthContext"
import * as Location from "expo-location"
import { Feather } from "@expo/vector-icons"

const HomeScreen = () => {
  const { user, logout } = useAuth()
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setLocationError("Permission to access location was denied")
        return
      }
    })()
  }, [])

  const startTracking = async () => {
    try {
      setIsTracking(true)

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })
      setLocation(currentLocation)

      // Start watching position
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation(newLocation)
          sendLocationToServer(newLocation)
        },
      )

      Alert.alert("Tracking Started", "Your location is now being tracked.")
    } catch (error) {
      console.error("Error starting tracking:", error)
      setLocationError("Failed to start location tracking")
      setIsTracking(false)
    }
  }

  const stopTracking = () => {
    // In a real app, you would unsubscribe from the location watcher
    setIsTracking(false)
    Alert.alert("Tracking Stopped", "Your location is no longer being tracked.")
  }

  const sendLocationToServer = async (locationData: Location.LocationObject) => {
    try {
      // In a real app, you would send this data to your server
      console.log("Sending location to server:", {
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
        timestamp: locationData.timestamp,
        userId: user?.id,
      })

      // Mock API call
      // await fetch('https://your-api.com/location', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     latitude: locationData.coords.latitude,
      //     longitude: locationData.coords.longitude,
      //     timestamp: locationData.timestamp,
      //     userId: user?.id,
      //   }),
      // });
    } catch (error) {
      console.error("Error sending location to server:", error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AutoSched</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Feather name="log-out" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Welcome, {user?.name || user?.username}</Text>

        {locationError ? <Text style={styles.errorText}>{locationError}</Text> : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location Status</Text>
          {location ? (
            <View style={styles.locationData}>
              <Text style={styles.locationText}>Latitude: {location.coords.latitude.toFixed(6)}</Text>
              <Text style={styles.locationText}>Longitude: {location.coords.longitude.toFixed(6)}</Text>
              <Text style={styles.locationText}>Accuracy: {location.coords.accuracy?.toFixed(2)} meters</Text>
              <Text style={styles.locationText}>Last Updated: {new Date(location.timestamp).toLocaleTimeString()}</Text>
            </View>
          ) : (
            <Text style={styles.noDataText}>No location data available</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.trackingButton, isTracking ? styles.stopButton : styles.startButton]}
          onPress={isTracking ? stopTracking : startTracking}
        >
          <Text style={styles.trackingButtonText}>{isTracking ? "Stop Tracking" : "Start Tracking"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
  },
  errorText: {
    color: "#ef4444",
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 12,
  },
  locationData: {
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  noDataText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  trackingButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  startButton: {
    backgroundColor: "#000",
  },
  stopButton: {
    backgroundColor: "#ef4444",
  },
  trackingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
})

export default HomeScreen

