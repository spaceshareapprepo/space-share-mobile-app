/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0A7EA4';
const tintColorDark = '#4DBCE8';

export const Colors = {
  light: {
    // Text & Content
    text: '#11181C',
    textSecondary: '#49454E',
    textTertiary: '#79747E',
    textDisabled: '#C9C7CC',
    
    // Background & Surface
    background: '#FFFBFE',
    surface: '#FFF8FB',
    surfaceVariant: '#E7E0EC',
    
    // Primary (Tint)
    tint: tintColorLight,
    primary: tintColorLight,
    primaryContainer: '#B3E5FC',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#001F2F',
    
    // Secondary
    secondary: '#006A6A',
    secondaryContainer: '#4FBFBF',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#002020',
    
    // Tertiary
    tertiary: '#7D5260',
    tertiaryContainer: '#FFD8E4',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#31111D',
    
    // Error
    error: '#B3261E',
    errorContainer: '#F9DEDC',
    onError: '#FFFFFF',
    onErrorContainer: '#410E0B',
    
    // Status
    success: '#0CAF50',
    warning: '#F57C00',
    info: '#0a7ea4',
    
    // Icon & Interactive
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    // Text & Content
    text: '#ECEDEE',
    textSecondary: '#CAC7D0',
    textTertiary: '#B0AABC',
    textDisabled: '#605F63',
    
    // Background & Surface
    background: '#0F0D13',
    surface: '#1B1B1F',
    surfaceVariant: '#49454E',
    
    // Primary (Tint)
    tint: tintColorDark,
    primary: tintColorDark,
    primaryContainer: '#004D62',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#B3E5FC',
    
    // Secondary
    secondary: '#4FBFBF',
    secondaryContainer: '#004D4D',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#4FBFBF',
    
    // Tertiary
    tertiary: '#FFB1C6',
    tertiaryContainer: '#603B48',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#FFD8E4',
    
    // Error
    error: '#F2B8B5',
    errorContainer: '#601410',
    onError: '#8B0000',
    onErrorContainer: '#F9DEDC',
    
    // Status
    success: '#66BB6A',
    warning: '#FFB74D',
    info: '#4DBCE8',
    
    // Icon & Interactive
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
