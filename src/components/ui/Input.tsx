import { TextInput, StyleSheet, View, type TextInputProps } from "react-native"

interface InputProps extends TextInputProps {
  error?: boolean
}

export const Input = ({ error, style, ...props }: InputProps) => {
  return (
    <View style={[styles.container, error && styles.errorContainer, style]}>
      <TextInput style={styles.input} placeholderTextColor="#a1a1aa" {...props} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 6,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  errorContainer: {
    borderColor: "#ef4444",
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#27272a",
  },
})

