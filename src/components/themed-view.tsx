import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  safeArea?: boolean;
};

export function ThemedView({ style, lightColor, darkColor, safeArea = false, ...otherProps }: ThemedViewProps) {
  const insets = useSafeAreaInsets();
  const safeAreaStyle = safeArea
    ? { paddingHorizontal: Math.max(insets.left, insets.right), paddingVertical: Math.max(insets.top, insets.bottom) }
    : null;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (<View style={[{ backgroundColor }, safeAreaStyle, style,]} {...otherProps}/>);
}
