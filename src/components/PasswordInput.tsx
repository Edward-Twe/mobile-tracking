"use client"

import { useState } from "react"
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { Feather } from "@expo/vector-icons"

interface PasswordInputProps {
  value: string
  onChangeText: (text: string) => void
  onBlur?: () => void
  error?: boolean
}

const PasswordInput = ({ value, onChangeText, onBlur, error }: PasswordInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <View style={[styles.container, error && styles.containerError]}>
      <TextInput
        style={styles.input}
        secureTextEntry={!isPasswordVisible}
        placeholder="Password"
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.iconButton} onPress={togglePasswordVisibility}>
        <Feather name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="#71717a" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  containerError: {
    borderColor: "#ef4444",
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  iconButton: {
    padding: 10,
  },
})

export default PasswordInput

