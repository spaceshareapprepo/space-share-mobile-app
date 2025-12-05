import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface Traveller {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  rating: number;
  trips: number;
  price: number;
  from: string;
  fromCity: string;
  to: string;
  toCity: string;
  date: string;
  description: string;
  weight: number;
}

interface SearchResultCardProps {
  traveller: Traveller;
  onConnect?: (traveller: Traveller) => void;
}


export default function SearchResultCard({ 
  traveller, 
  onConnect 
}: SearchResultCardProps ) {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const avatarScale = useRef(new Animated.Value(1)).current;
  const priceScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }),
      Animated.spring(avatarScale, {
        toValue: 1.1,
        useNativeDriver: true,
      }),
      Animated.spring(priceScale, {
        toValue: 1.05,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(avatarScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(priceScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View 
        style={[
          styles.card,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Animated.View 
              style={[
                styles.avatar,
                { transform: [{ scale: avatarScale }] }
              ]}
            >
              <Text style={styles.avatarText}>{traveller.avatar}</Text>
            </Animated.View>
            <View>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{traveller.name}</Text>
                {traveller.verified && (
                  <Ionicons name="shield-checkmark" size={14} color="#10B981" />
                )}
              </View>
              <View style={styles.statsContainer}>
                <Ionicons name="star" size={12} color="#FBBf24" />
                <Text style={styles.statsText}>{traveller.rating}</Text>
                <Text style={styles.statsSeparator}>·</Text>
                <Text style={styles.statsText}>{traveller.trips} trips</Text>
              </View>
            </View>
          </View>
          <Animated.View 
            style={[
              styles.priceTag,
              { transform: [{ scale: priceScale }] }
            ]}
          >
            <Text style={styles.priceAmount}>${traveller.price}</Text>
            <Text style={styles.priceUnit}>/kg</Text>
          </Animated.View>
        </View>

        {/* Route Display */}
        <View style={styles.routeContainer}>
          <View style={styles.routeContent}>
            <View style={styles.locationInfo}>
              <Text style={styles.locationCode}>{traveller.from}</Text>
              <Text style={styles.locationCity}>{traveller.fromCity}</Text>
            </View>
            
            <View style={styles.routeLineContainer}>
              <View style={styles.routeLine}>
                <View style={styles.dotStart} />
                <View style={styles.dashedLine} />
                <MaterialCommunityIcons 
                  name="airplane" 
                  size={16} 
                  color="#FB923C"
                  style={{ transform: [{ rotate: '45deg' }] }}
                />
                <View style={styles.dashedLine} />
                <View style={styles.dotEnd} />
              </View>
              <Text style={styles.dateText}>{traveller.date}</Text>
            </View>
            
            <View style={styles.locationInfo}>
              <Text style={styles.locationCode}>{traveller.to}</Text>
              <Text style={styles.locationCity}>{traveller.toCity}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>{traveller.description}</Text>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.weightContainer}>
            <Ionicons name="cube-outline" size={14} color="#6B7280" />
            <Text style={styles.weightText}>{traveller.weight}kg available</Text>
          </View>
          <TouchableOpacity 
            style={styles.connectButton}
            onPress={() => onConnect?.(traveller)}
            activeOpacity={0.8}
          >
            <Text style={styles.connectButtonText}>Connect</Text>
            <Ionicons name="chevron-forward" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  statsText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statsSeparator: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  priceTag: {
    backgroundColor: '#FBBf24',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  priceUnit: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  routeContainer: {
    marginTop: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
  },
  routeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationInfo: {
    alignItems: 'center',
  },
  locationCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  locationCity: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  routeLineContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  routeLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotStart: {
    width: 8,
    height: 8,
    backgroundColor: '#000',
    borderRadius: 4,
  },
  dashedLine: {
    flex: 1,
    height: 2,
    borderTopWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    marginHorizontal: 8,
  },
  dotEnd: {
    width: 8,
    height: 8,
    backgroundColor: '#FBBf24',
    borderRadius: 4,
  },
  dateText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weightText: {
    fontSize: 14,
    color: '#6B7280',
  },
  connectButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  connectButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
});