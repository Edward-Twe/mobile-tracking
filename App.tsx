import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StatusBar } from "expo-status-bar"
import { AuthProvider } from "./src/context/AuthContext"
import { OrganizationProvider } from "./src/context/OrganizationContext"
import KanbanScreen from "./src/screens/KanbanScreen"
import ReportScreen from "./src/screens/ReportScreen"
import ProfileScreen from "./src/screens/ProfileScreen"
import TabBar from "./src/components/TarBar"
import LoginScreen from "./src/screens/LoginScreen"
import { useAuth } from "./src/context/AuthContext"
import { Feather } from '@expo/vector-icons'
import { navigationRef } from './navigationUtils'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import KanbanDetailScreen from "./src/screens/KanbanDetailScreen"
import { createStackNavigator } from '@react-navigation/stack'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function AppNavigator() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <LoginScreen />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Report"
          component={ReportScreen}
          options={{
            tabBarLabel: "Report",
            tabBarIcon: ({ focused }) => <Feather name="bar-chart" size={20} color={focused ? "#4299e1" : "#718096"} />,
          }}
        />
        <Tab.Screen
          name="Kanban"
          component={KanbanScreen}
          options={{
            tabBarLabel: "Kanban",
            tabBarIcon: ({ focused }) => <Feather name="trello" size={20} color={focused ? "#4299e1" : "#718096"} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ focused }) => <Feather name="user" size={20} color={focused ? "#4299e1" : "#718096"} />,
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <OrganizationProvider>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator>
              <Stack.Screen 
                name="Main" 
                component={AppNavigator} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Kanban Detail Screen" 
                component={KanbanDetailScreen}
                options={{
                  headerShown: true,
                  headerTitle: "Kanban Details",
                  headerBackTitle: "Back"
                }}
              />
            </Stack.Navigator>
            <StatusBar style="auto" />
          </NavigationContainer>
        </OrganizationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}

