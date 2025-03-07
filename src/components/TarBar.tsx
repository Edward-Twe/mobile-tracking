import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { Feather } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label = (options.tabBarLabel as string) || options.title || route.name
        const isFocused = state.index === index

        let iconName: keyof typeof Feather.glyphMap = 'circle'
        if (options.tabBarIcon) {
          const icon = options.tabBarIcon?.({ focused: isFocused, color: '', size: 0 }) as React.ReactElement
          if (icon?.props?.name) {
            iconName = icon.props.name
          }
        }

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        // Middle tab (Kanban)
        if (index === 1) {
          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.middleTab}>
              <View style={styles.middleTabButton}>
                <Feather name="trello" size={24} color="#fff" />
              </View>
              <Text style={styles.middleTabLabel}>{label}</Text>
            </TouchableOpacity>
          )
        }

        // Regular tabs (Report and Profile)
        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.tab}>
            <Feather name={iconName} size={20} color={isFocused ? "#4299e1" : "#718096"} />
            <Text style={[styles.label, { color: isFocused ? "#4299e1" : "#718096" }]}>{label}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    height: 70,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  middleTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    top: -20,
  },
  middleTabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4299e1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  middleTabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: "#4299e1",
    fontWeight: "500",
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
})

export default TabBar

