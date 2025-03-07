import type React from "react"
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type TouchableOpacityProps,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from "react-native"

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode
  variant?: "default" | "outline" | "ghost"
  loading?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

export const Button = ({ children, variant = "default", loading = false, style, textStyle, ...props }: ButtonProps) => {
  const buttonStyles = [
    styles.button,
    variant === "outline" && styles.outlineButton,
    variant === "ghost" && styles.ghostButton,
    style,
  ]

  const textStyles = [
    styles.text,
    variant === "outline" && styles.outlineText,
    variant === "ghost" && styles.ghostText,
    textStyle,
  ]

  return (
    <TouchableOpacity style={buttonStyles} disabled={loading || props.disabled} {...props}>
      {loading ? (
        <ActivityIndicator color={variant === "default" ? "#fff" : "#000"} size="small" />
      ) : (
        <Text style={textStyles}>{children}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },
  ghostButton: {
    backgroundColor: "transparent",
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  outlineText: {
    color: "#000",
  },
  ghostText: {
    color: "#000",
  },
})

