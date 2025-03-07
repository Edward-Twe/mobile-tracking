"use client"

import { useState } from "react"
import { View, TextInput, TouchableOpacity, StyleSheet, type TextInputProps } from "react-native"
import { Feather } from "@expo/vector-icons"

interface PasswordInputProps extends TextInputProps {
  error?: boolean
}

export const PasswordInput = ({ error, style, ...props }: PasswordInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <View style={[styles.container, error && styles.errorContainer, style]}>
      <TextInput style={styles.input} secureTextEntry={!isPasswordVisible} placeholderTextColor="#a1a1aa" {...props} />
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
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  errorContainer: {
    borderColor: "#ef4444",
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#27272a",
  },
  iconButton: {
    padding: 10,
  },
})

