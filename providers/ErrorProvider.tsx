import { router } from "expo-router";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

interface ErrorContextType {
  error: Error | null;
  reportError: (error: Error) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  const reportError = (err: Error) => {
    console.error("Caught global error:", err);
    setError(err);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ error, reportError, clearError }}>
      {error ? <GlobalErrorFallback error={error} onReset={clearError} /> : children}
    </ErrorContext.Provider>
  );
}

export function useGlobalError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useGlobalError must be used within an ErrorProvider");
  }
  return context;
}

function GlobalErrorFallback({ error, onReset }: { error: Error; onReset: () => void }) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText weight="700" style={styles.title}>
          Something went wrong
        </ThemedText>
        <ThemedText style={styles.message}>
          {error.message || "An unexpected error occurred."}
        </ThemedText>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={onReset}
          >
            <ThemedText weight="500" style={styles.buttonText}>
              Try Again
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={() => router.replace("/")}
          >
            <ThemedText weight="500" style={[styles.buttonText, styles.secondaryButtonText]}>
              Go to Home
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  content: {
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    opacity: 0.7,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  secondaryButtonText: {
    color: "#374151",
  },
});
