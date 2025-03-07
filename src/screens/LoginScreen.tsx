import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    SafeAreaView,
  } from "react-native"
  import LoginForm from "../components/LoginForm"
  import { NavigationProp, useNavigation } from "@react-navigation/native"
  
  type RootStackParamList = {
    Signup: undefined;
    Home: undefined;
    // ... other screens
  };
  
  const LoginScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoid}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.contentContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.title}>Login to AutoSched</Text>
                <Text style={styles.subtitle}>Login with username and password.</Text>
              </View>
  
              <View style={styles.formContainer}>
                <LoginForm />
              </View>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    keyboardAvoid: {
      flex: 1,
    },
    scrollView: {
      flexGrow: 1,
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      maxWidth: 500,
      alignSelf: "center",
      width: "100%",
    },
    headerContainer: {
      alignItems: "center",
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: "600",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: "#666",
    },
    formContainer: {
      width: "100%",
      gap: 24,
    },
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 16,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: "#e5e5e5",
    },
    dividerText: {
      paddingHorizontal: 10,
      fontSize: 12,
      color: "#666",
      textTransform: "uppercase",
    },
    signupButton: {
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    signupButtonText: {
      fontSize: 14,
      fontWeight: "500",
    },
    image: {
      width: "100%",
      height: 200,
      marginTop: 20,
    },
  })
  
  export default LoginScreen
  
  