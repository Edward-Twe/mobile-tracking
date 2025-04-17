import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Alert } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"

const ProfileScreen = () => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => logout(),
        style: "destructive",
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}</Text>
            </View>
          )}
        </View>

        <Text style={styles.userName}>{user?.name || user?.username || "User"}</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Feather name="mail" size={18} color="#718096" style={styles.infoIcon} />
            <Text style={styles.infoText}>{user?.email || "email@example.com"}</Text>
          </View>

          <View style={styles.infoItem}>
            <Feather name="briefcase" size={18} color="#718096" style={styles.infoIcon} />
            <Text style={styles.infoText}>{user?.role || "Employee"}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={20} color="#e53e3e" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  header: {
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
  profileSection: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4299e1",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoContainer: {
    width: "100%",
    marginTop: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#4a5568",
  },
  actionsSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  actionText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  actionArrow: {
    marginLeft: "auto",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    color: "#e53e3e",
    fontWeight: "500",
    marginLeft: 8,
  },
})

export default ProfileScreen

