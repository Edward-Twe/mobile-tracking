"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native"
import { Feather } from "@expo/vector-icons"
import OrganizationDropdown from "../components/OrganizationDropdown"
import { useOrganization } from "../context/OrganizationContext"
import { useAuth } from "../context/AuthContext"
import { loadSchedules, Schedule } from "../services/api"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import KanbanDetailScreen from './KanbanDetailScreen';

// Define the props type
type KanbanScreenProps = {
  navigation: BottomTabNavigationProp<any>;
};

const KanbanScreen = ({ navigation }: KanbanScreenProps) => {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const { selectedOrganization } = useOrganization()
  const { user } = useAuth()

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!user?.id || !selectedOrganization?.id) {
        console.log("Missing user or org ID:", { user, selectedOrganization });
        setLoading(false); // Stop loading if no user or organization
        return;
      }

      try {
        setLoading(true)
        const employee = (await AsyncStorage.getItem("employee"))
        if (!employee) {
          throw new Error("Employee not found")
        }
        
        const employeeObj = JSON.parse(employee)
        const response = await loadSchedules(employeeObj.id, selectedOrganization.id)
        console.log("Received schedules:", response);
        
        if (response && Array.isArray(response)) {
          setSchedules(response)
        } else {
          console.error("Invalid schedule data format")
          setSchedules([])
        }
      } catch (error) {
        console.error("Error fetching schedules:", error)
        setSchedules([])
      } finally {
        setLoading(false)
      }
    }

    fetchSchedules()
  }, [selectedOrganization?.id, user?.id])

  const renderScheduleItem = ({ item }: { item: Schedule }) => {
    const onPress = () => {
      navigation.navigate("Kanban Detail Screen", { scheduleId: item.id });
    };

    return (
      <TouchableOpacity 
        style={styles.scheduleCard} 
        onPress={onPress} // Use the updated onPress function
      >
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleName}>{item.name}</Text>
        </View>
        <View style={styles.scheduleDetails}>
          <View style={styles.scheduleDetail}>
            <Feather name="calendar" size={14} color="#718096" />
            <Text style={styles.scheduleDetailText}>Created: {new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
          <View style={styles.scheduleDetail}>
            <Feather name="clock" size={14} color="#718096" />
            <Text style={styles.scheduleDetailText}>Depart: {new Date(item.departTime).toLocaleDateString()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedules</Text>
        <OrganizationDropdown />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4299e1" />
          <Text style={styles.loadingText}>Loading schedules...</Text>
        </View>
      ) : !selectedOrganization ? ( // Check if no organization is selected
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Please select an organization to view schedules.</Text>
        </View>
      ) : (
        <FlatList
          data={schedules}
          renderItem={renderScheduleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.schedulesList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#718096",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageText: {
    color: "#718096",
    fontSize: 16,
    textAlign: "center",
  },
  schedulesList: {
    padding: 16,
  },
  scheduleCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  scheduleName: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  scheduleDetails: {
    gap: 8,
  },
  scheduleDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  scheduleDetailText: {
    fontSize: 14,
    color: "#4a5568",
  },
})

export default KanbanScreen

