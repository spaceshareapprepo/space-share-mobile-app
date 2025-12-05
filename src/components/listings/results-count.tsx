import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ResultsHeaderProps {
  resultCount: number;
  onSortPress?: () => void;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({ 
  resultCount, 
  onSortPress 
}) => {
  // Animation value
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation with delay
    Animated.sequence([
      Animated.delay(400),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container,
        { opacity: fadeAnim }
      ]}
    >
      {/* Results Count */}
      <Text style={styles.title}>
        {resultCount} {resultCount === 1 ? 'match' : 'matches'}
      </Text>

      {/* Sort Button */}
      <TouchableOpacity 
        style={styles.sortButton}
        onPress={onSortPress}
        activeOpacity={0.6}
      >
        <Text style={styles.sortText}>Sort by</Text>
        <Ionicons name="chevron-forward" size={16} color="#6B7280" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default ResultsHeader;