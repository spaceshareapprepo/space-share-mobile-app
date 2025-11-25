import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet, View } from 'react-native';

export function ListingDetailsSkeleton() {
  return (
    <Box>
      <ThemedView style={styles.container}>
        {/* Hero Card */}
        <ThemedView style={styles.heroCard}>
          <HStack className="gap-4">
            <Skeleton variant="circular" className="h-14 w-14" />
            <VStack className="flex-1 gap-2">
              <SkeletonText _lines={1} className="h-4 w-3/4" />
              <SkeletonText _lines={1} className="h-3 w-2/3" />
              <SkeletonText _lines={1} className="h-3 w-1/2" />
            </VStack>
          </HStack>
          <Skeleton variant="sharp" className="h-8 w-1/3 rounded-full mt-3" />
        </ThemedView>

        {/* Section Card 1 */}
        <ThemedView style={styles.sectionCard}>
          <HStack className="gap-2 mb-4">
            <Skeleton variant="circular" className="h-5 w-5" />
            <SkeletonText _lines={1} className="h-4 w-1/3" />
          </HStack>

          {/* Metric Grid */}
          <View style={styles.metricGrid}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.metricCard}>
                <SkeletonText _lines={1} className="h-3 w-2/3 mb-2" />
                <SkeletonText _lines={1} className="h-5 w-4/5 mb-1" />
                <SkeletonText _lines={1} className="h-3 w-3/4" />
              </View>
            ))}
          </View>

          {/* Description */}
          <SkeletonText _lines={3} className="h-4 mt-4" />
        </ThemedView>

        {/* Section Card 2 */}
        <ThemedView style={styles.sectionCard}>
          <HStack className="gap-2 mb-4">
            <Skeleton variant="circular" className="h-5 w-5" />
            <SkeletonText _lines={1} className="h-4 w-1/3" />
          </HStack>
          <SkeletonText _lines={3} className="h-4" />
        </ThemedView>

        {/* Section Card 3 */}
        <ThemedView style={styles.sectionCard}>
          <HStack className="gap-2 mb-4">
            <Skeleton variant="circular" className="h-5 w-5" />
            <SkeletonText _lines={1} className="h-4 w-1/4" />
          </HStack>
          <SkeletonText _lines={3} className="h-4" />
        </ThemedView>
      </ThemedView>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingBottom: 48,
    padding: 16,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    gap: 16,
  },
  sectionCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
    minWidth: "45%",
  },
});