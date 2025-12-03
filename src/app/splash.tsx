import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  splashExiting?: boolean;
}


export default function SplashScreenComponent<SplashScreenProps>({ splashExiting = false }) {
  // Animation values
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;
  const dot1Scale = useRef(new Animated.Value(1)).current;
  const dot2Scale = useRef(new Animated.Value(1)).current;
  const dot3Scale = useRef(new Animated.Value(1)).current;
  const fadeOutOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Floating animations for decorative circles
    const createFloatAnimation = (animValue: Animated.Value, duration: number, delay: number = 0) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            delay: delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    createFloatAnimation(floatAnim1, 3000).start();
    createFloatAnimation(floatAnim2, 3000, 1000).start();
    createFloatAnimation(floatAnim3, 3000, 500).start();

    // Logo bounce in and float
    Animated.sequence([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoFloat, {
            toValue: -10,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(logoFloat, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // Fade in title, subtitle, and loading indicator
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 800,
      delay: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(subtitleOpacity, {
      toValue: 1,
      duration: 800,
      delay: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(loadingOpacity, {
      toValue: 1,
      duration: 800,
      delay: 800,
      useNativeDriver: true,
    }).start();

    // Pulsing dots
    const createPulseAnimation = (dotScale: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(dotScale, {
            toValue: 1.5,
            duration: 600,
            delay: delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(dotScale, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    createPulseAnimation(dot1Scale, 0).start();
    createPulseAnimation(dot2Scale, 200).start();
    createPulseAnimation(dot3Scale, 400).start();
  }, []);

  useEffect(() => {
    if (splashExiting) {
      Animated.timing(fadeOutOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [splashExiting]);

  const float1TranslateY = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const float2TranslateY = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const float3TranslateY = floatAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeOutOpacity }]}>
      {/* Background decorative elements */}
      <Animated.View
        style={[
          styles.decorativeCircle,
          styles.decorativeCircle1,
          { transform: [{ translateY: float1TranslateY }] },
        ]}
      />
      <Animated.View
        style={[
          styles.decorativeCircle,
          styles.decorativeCircle2,
          { transform: [{ translateY: float2TranslateY }] },
        ]}
      />
      <Animated.View
        style={[
          styles.decorativeCircle,
          styles.decorativeCircle3,
          { transform: [{ translateY: float3TranslateY }] },
        ]}
      />

      {/* Logo */}
      <Animated.View
        style={{
          transform: [
            { scale: logoScale },
            { translateY: logoFloat },
          ],
        }}
      >
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons
            name="airplane"
            size={48}
            color="#000"
            style={{ transform: [{ rotate: '45deg' }] }}
          />
        </View>
      </Animated.View>

      {/* Brand Name */}
      <Animated.View style={{ opacity: titleOpacity }}>
        <Text style={styles.title}>
          Space<Text style={styles.titleAccent}>Share</Text>
        </Text>
      </Animated.View>

      <Animated.View style={{ opacity: subtitleOpacity }}>
        <Text style={styles.subtitle}>Share your journey, deliver joy</Text>
      </Animated.View>

      {/* Loading indicator */}
      <Animated.View style={[styles.loadingContainer, { opacity: loadingOpacity }]}>
        <Animated.View style={[styles.dot, { transform: [{ scale: dot1Scale }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ scale: dot2Scale }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ scale: dot3Scale }] }]} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  decorativeCircle1: {
    top: 80,
    left: 40,
    width: 128,
    height: 128,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
  },
  decorativeCircle2: {
    bottom: 128,
    right: 40,
    width: 160,
    height: 160,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },
  decorativeCircle3: {
    top: height / 3,
    right: 80,
    width: 96,
    height: 96,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  logoContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#FBBf24',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FBBf24',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 32,
  },
  titleAccent: {
    color: '#FBBf24',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 48,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#FBBf24',
    borderRadius: 4,
  },
});
