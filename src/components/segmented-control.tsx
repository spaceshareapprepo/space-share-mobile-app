import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

export type SegmentOption<TKey extends string> = {
  key: TKey;
  label: string;
};

type SegmentedControlProps<TKey extends string> = {
  options: ReadonlyArray<SegmentOption<TKey>>;
  value: TKey;
  onChange: (key: TKey) => void;
  tintColor: string;
  borderColor: string;
};

export function SegmentedControl<TKey extends string>({
  options,
  value,
  onChange,
  tintColor,
  borderColor,
}: SegmentedControlProps<TKey>) {
  return (
    <View style={[styles.container, { borderColor }]}>
      {options.map((option) => {
        const isActive = option.key === value;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            style={[
              styles.button,
              isActive && { backgroundColor: tintColor },
            ]}
          >
            <ThemedText
              style={[
                styles.label,
                isActive ? styles.labelActive : undefined,
              ]}
            >
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 999,
    flexDirection: "row",
    gap: 4,
    padding: 4,
  },
  button: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
  },
  labelActive: {
    color: "#fff",
  },
});
