import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useDatePicker } from "@/hooks/use-date-picker";
import { format } from "date-fns";
import { SearchDropdown } from "./search-dropdown";

interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  weight: string;
  weightUnit: "kg" | "lb";
}

type HeroSectionProps = {
  onSearch?: (params: SearchParams) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps){
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showArrivalPicker, setShowArrivalPicker] = useState(false);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;

  const departurePicker = useDatePicker({
    onSelect: (date) => {
      setDepartureDate(date ? format(new Date(date as any), "yyyy-MM-dd") : "");
      setShowDeparturePicker(false);
    },
  });
  const arrivalPicker = useDatePicker({
    onSelect: (date) =>{
      setArrivalDate(date ? format(new Date(date as any), "yyyy-MM-dd") : "");
      setShowArrivalPicker(false);
    }
  });

  useEffect(() => {
    // Scale in animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Staggered fade-in animations
    Animated.sequence([
      Animated.delay(100),
      Animated.timing(fadeAnim1, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.delay(200),
      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.delay(300),
      Animated.timing(fadeAnim3, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        origin,
        destination,
        departureDate,
        arrivalDate,
        weight,
        weightUnit,
      });
    }
  };

  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
    >
      <LinearGradient
        colors={["#FBBf24", "#FBBF24", "#FB923C"]} // amber-400, yellow-400, orange-400
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Background decorative elements */}
        <View style={[styles.decorativeCircle, styles.decorativeCircle1]} />
        <View style={[styles.decorativeCircle, styles.decorativeCircle2]} />

        {/* Title */}
        <Animated.View style={{ opacity: fadeAnim1 }}>
          <Text style={styles.title}>
            Find your{"\n"}
            <Text style={styles.titleItalic}>perfect</Text> match
          </Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View style={{ opacity: fadeAnim2 }}>
          <Text style={styles.subtitle}>USA ↔ Ghana corridor</Text>
        </Animated.View>

        {/* Search Inputs */}
        <Animated.View style={[styles.searchContainer, { opacity: fadeAnim3 }]}>
           <SearchDropdown placeholder="Origin" iconName="location-outline"/>
          {/* Origin and Destination with Swap Button */}
          <View style={styles.locationContainer}>
            {/* Origin Input */}
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={18} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                placeholder="Origin (e.g., Accra)"
                placeholderTextColor="#9CA3AF"
                value={origin}
                onChangeText={setOrigin}
              />
            </View>

            {/* Swap Button */}
            <TouchableOpacity
              style={styles.swapButton}
              onPress={handleSwapLocations}
              activeOpacity={0.7}
            >
              <Ionicons name="swap-vertical" size={24} color="#000" />
            </TouchableOpacity>

            {/* Destination Input */}
            <View style={styles.inputWrapper}>
              <Ionicons name="navigate-outline" size={18} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                placeholder="Destination (e.g., New York)"
                placeholderTextColor="#9CA3AF"
                value={destination}
                onChangeText={setDestination}
              />
            </View>
          </View>

          {/* Date Inputs Row */}
          <View style={styles.dateRow}>
            {/* Departure Date */}
            <TouchableOpacity
              style={[styles.inputWrapper, styles.dateInput]}
              onPress={() => setShowDeparturePicker(true)}
            >
              <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
              <Text style={styles.input}>{departureDate || "Departure Date"}</Text>
            </TouchableOpacity>
            {/* Arrival Date */}
            <TouchableOpacity
              style={[styles.inputWrapper, styles.dateInput]}
              onPress={() => setShowArrivalPicker(true)}
            >
              <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
              <Text style={styles.input}>{arrivalDate || "Arrival Date"}</Text>
            </TouchableOpacity>
          </View>

          {/* Weight Input with Unit Toggle */}
          <View style={styles.weightContainer}>
            <View style={[styles.inputWrapper, styles.weightInput]}>
              <Ionicons name="cube-outline" size={18} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                placeholder="Weight"
                placeholderTextColor="#9CA3AF"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
            </View>

            {/* Unit Toggle */}
            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  weightUnit === "kg" && styles.unitButtonActive,
                ]}
                onPress={() => setWeightUnit("kg")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.unitText,
                    weightUnit === "kg" && styles.unitTextActive,
                  ]}
                >
                  kg
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  weightUnit === "lb" && styles.unitButtonActive,
                ]}
                onPress={() => setWeightUnit("lb")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.unitText,
                    weightUnit === "lb" && styles.unitTextActive,
                  ]}
                >
                  lb
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Button */}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            activeOpacity={0.8}
          >
            <Ionicons name="search" size={20} color="#FFF" />
            <Text style={styles.searchButtonText}>Find Spaces</Text>
          </TouchableOpacity>
        </Animated.View>
        { showDeparturePicker && (
          <view
            style={{
              backgroundColor: "#0005",
              alignItems: "center",
              justifyContent: "center"
            }}
            >
              <Modal
                visible={showDeparturePicker}
                animationType="slide"
                transparent
              >
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: "#0005" }}
                  onPress={() => setShowDeparturePicker(false)}
                />
                <View
                  style={{
                    backgroundColor: "#fff",
                    padding: 16,
                    borderRadius: 16,
                  }}
                >
                  {departurePicker.Picker}
                </View>
              </Modal>
            </view>
        )}
        { showArrivalPicker  && (
          <view
              style={{
                backgroundColor: "#0005",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Modal
                visible={showArrivalPicker}
                animationType="slide"
                transparent
              >
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: "#0005" }}
                  onPress={() => setShowArrivalPicker(false)}
                />
                <View
                  style={{
                    backgroundColor: "#fff",
                    padding: 16,
                    borderRadius: 16,
                  }}
                >
                  {arrivalPicker.Picker}
                </View>
              </Modal>
            </view>)}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 24,
    overflow: "hidden",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 5,
  },
  gradient: {
    padding: 24,
    position: "relative",
    overflow: "hidden",
  },
  decorativeCircle: {
    position: "absolute",
    borderRadius: 9999,
  },
  decorativeCircle1: {
    top: 0,
    right: 0,
    width: 128,
    height: 128,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transform: [{ translateY: -64 }, { translateX: 64 }],
  },
  decorativeCircle2: {
    bottom: 0,
    left: 0,
    width: 96,
    height: 96,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    transform: [{ translateY: 48 }, { translateX: -48 }],
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    lineHeight: 36,
  },
  titleItalic: {
    fontStyle: "italic",
    fontWeight: "300",
  },
  subtitle: {
    color: "rgba(0, 0, 0, 0.7)",
    marginTop: 8,
    fontSize: 14,
    maxWidth: 200,
  },
  searchContainer: {
    marginTop: 16,
    gap: 12,
  },
  locationContainer: {
    position: "relative",
    gap: 12,
  },
  swapButton: {
    position: "absolute",
    right: -12,
    top: "50%",
    transform: [{ translateY: -20 }, { translateX: -40 }],
    backgroundColor: "#FFF",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    // Shadow for Android
    elevation: 4,
    borderWidth: 2,
    borderColor: "#FBBf24",
  },
  inputWrapper: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
  },
  pickerContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginTop: 8,
    padding: 8,
  },
  dateRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-evenly"
  },
  dateInput: {
    flex: 1,
  },
  weightContainer: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  weightInput: {
    flex: 1,
  },
  unitToggle: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 4,
    gap: 4,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  unitButtonActive: {
    backgroundColor: "#000",
  },
  unitText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  unitTextActive: {
    color: "#FFF",
  },
  searchButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 5,
  },
  searchButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
