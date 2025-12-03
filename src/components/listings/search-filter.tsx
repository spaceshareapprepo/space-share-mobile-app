import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

export type ListingsOption<LKey extends string> = {
  key: LKey;
  label: string;
};

type SearchFilterComponentProps<LKey extends string> = {
  options: ReadonlyArray<ListingsOption<LKey>>;
  value: LKey;
  onChange: (key: LKey) => void;
};

export default function SearchFilterComponent<LKey extends string>({
  options,
  value,
  onChange,
}: SearchFilterComponentProps<LKey>) {
  // Animation value
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation with delay
    Animated.sequence([
      Animated.delay(300),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.toggleContainer}>
        {/* Travellers Button */}
        {options.map((option) => {
          const isActive = option.key === value;
          return (
            <TouchableOpacity
              key={option.key}
              style={[styles.toggleButton, isActive && styles.toggleButtonActive]}
              onPress={() => onChange(option.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.toggleText, isActive && styles.toggleTextActive]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  toggleContainer: {
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 4,
    flexDirection: "row",
    gap: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#FFF",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Shadow for Android
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  toggleTextActive: {
    color: "#000",
  },
});
