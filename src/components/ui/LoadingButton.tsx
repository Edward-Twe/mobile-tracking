import type React from "react"
import { Button } from "./Button"
import type { ViewStyle } from "react-native"

interface LoadingButtonProps {
  loading: boolean
  children: React.ReactNode
  onPress: () => void
  variant?: "default" | "outline" | "ghost"
  style?: ViewStyle
}

export const LoadingButton = ({ loading, children, onPress, variant = "default", style }: LoadingButtonProps) => {
  return (
    <Button loading={loading} onPress={onPress} disabled={loading} variant={variant} style={style}>
      {children}
    </Button>
  )
}

