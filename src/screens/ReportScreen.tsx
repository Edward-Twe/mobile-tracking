import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native"
import { Feather } from "@expo/vector-icons"
import OrganizationDropdown from "../components/OrganizationDropdown"

const ReportScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports</Text>
        <OrganizationDropdown />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: "#ebf8ff" }]}>
                <Feather name="calendar" size={20} color="#4299e1" />
              </View>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Scheduled</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: "#e6fffa" }]}>
                <Feather name="check-circle" size={20} color="#38b2ac" />
              </View>
              <Text style={styles.statValue}>18</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: "#fff5f5" }]}>
                <Feather name="alert-circle" size={20} color="#f56565" />
              </View>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Overdue</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>

          <TouchableOpacity style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>Monthly Performance</Text>
              <Feather name="chevron-right" size={20} color="#a0aec0" />
            </View>
            <Text style={styles.reportDate}>Generated on Oct 15, 2023</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>Task Completion Summary</Text>
              <Feather name="chevron-right" size={20} color="#a0aec0" />
            </View>
            <Text style={styles.reportDate}>Generated on Oct 10, 2023</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>Resource Allocation</Text>
              <Feather name="chevron-right" size={20} color="#a0aec0" />
            </View>
            <Text style={styles.reportDate}>Generated on Oct 5, 2023</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Generate Report</Text>

          <View style={styles.reportTypeContainer}>
            <TouchableOpacity style={styles.reportTypeCard}>
              <Feather name="bar-chart-2" size={24} color="#4299e1" />
              <Text style={styles.reportTypeName}>Performance</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reportTypeCard}>
              <Feather name="pie-chart" size={24} color="#4299e1" />
              <Text style={styles.reportTypeName}>Allocation</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reportTypeCard}>
              <Feather name="trending-up" size={24} color="#4299e1" />
              <Text style={styles.reportTypeName}>Progress</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reportTypeCard}>
              <Feather name="clock" size={24} color="#4299e1" />
              <Text style={styles.reportTypeName}>Time</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#718096",
  },
  reportCard: {
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
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  reportDate: {
    fontSize: 12,
    color: "#718096",
  },
  reportTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  reportTypeCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportTypeName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },
})

export default ReportScreen

