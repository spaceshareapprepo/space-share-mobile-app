// Fallback for using MaterialIcons on Android and web.

import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconLibrary = 'MaterialIcons' | 'Feather' | 'Ionicons' | 'FontAwesome6';

type IconConfig = {
  library: IconLibrary;
  name: string;
};

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const ICON_MAPPING: Record<string, IconConfig> = {
  // Material Icons
  "house.fill": { library: 'MaterialIcons', name: "home" },
  "paperplane.fill": { library: 'MaterialIcons', name: "send" },
  "chevron.left.forwardslash.chevron.right": { library: 'MaterialIcons', name: "code" },
  "chevron.right": { library: 'MaterialIcons', name: "chevron-right" },
  "airplane.circle.fill": { library: 'MaterialIcons', name: "flight" },
  "bubble.left.and.bubble.right.fill": { library: 'MaterialIcons', name: "forum" },
  "checkmark.seal.fill": { library: 'MaterialIcons', name: "verified" },
  "clock.fill": { library: 'MaterialIcons', name: "schedule" },
  "cube.box.fill": { library: 'MaterialIcons', name: "local-shipping" },
  "plus.circle.fill": { library: 'MaterialIcons', name: "add-circle" },
  "tray.full.fill": { library: 'MaterialIcons', name: "inbox" },
  "bell.fill": { library: 'MaterialIcons', name: "notifications" },
  "megaphone.fill": { library: 'MaterialIcons', name: "campaign" },
  "magnifyingglass": { library: 'MaterialIcons', name: "search" },
  "person.crop.circle": { library: 'MaterialIcons', name: "person" },
  "plus.circle.outline": { library: 'MaterialIcons', name: "add-circle-outline" },
  "workspace.outline": { library: 'MaterialIcons', name: "workspaces-outline" },
  "account.circle": { library: 'MaterialIcons', name: "account-circle" },
  
  // Feather Icons
  "cube.box": { library: 'Feather', name: "box" },
  
  // Ionicons
  "chatbubbles.outline": { library: 'Ionicons', name: "chatbubbles-outline" },

  // FontAwesome6
  "user.circle.fontawesome6": { library: 'FontAwesome6', name: "user-circle" },
};

type IconSymbolName = keyof typeof ICON_MAPPING;

/**
 * An icon component that uses native SF Symbols on iOS, and appropriate icon libraries on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to icon libraries.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: Readonly<{
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}>) {
  const config = ICON_MAPPING[name];
  
  if (!config) {
    console.warn(`Icon mapping not found for: ${name}`);
    return null;
  }

  const iconProps = { color, size, style };

  switch (config.library) {
    case 'MaterialIcons':
      return <MaterialIcons {...iconProps} name={config.name as ComponentProps<typeof MaterialIcons>['name']} />;
    case 'Feather':
      return <Feather {...iconProps} name={config.name as ComponentProps<typeof Feather>['name']} />;
    case 'Ionicons':
      return <Ionicons {...iconProps} name={config.name as ComponentProps<typeof Ionicons>['name']} />;
    case 'FontAwesome6':
      return <FontAwesome6 {...iconProps} name={config.name as ComponentProps<typeof FontAwesome6>['name']} />;
    default:
      return null;
  }
}