
import { Button, ButtonText } from '@/components/ui/button';
import {
    Drawer,
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
} from '@/components/ui/drawer';
import { Heading } from '@/components/ui/heading';
import { CloseIcon, Icon, MenuIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useDrawer } from "@/providers/gluestack-drawer-provider";
import { router } from 'expo-router';
import { Pressable } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export function DrawerButton() {
    const colorScheme = useColorScheme();
    const { isOpen, openDrawer, closeDrawer } = useDrawer();
    return (

        <Pressable
            onPress={openDrawer}
            hitSlop={12}
            accessibilityLabel="Open inbox">
            <Icon as={MenuIcon}
                size="xl"
                color={Colors[colorScheme ?? "light"].tint} />


            <Drawer
                isOpen={isOpen}
                size="lg"
                anchor="left"
                onClose={closeDrawer}
            >
                <DrawerBackdrop />
                <DrawerContent
                style={{ paddingTop: 55, paddingBottom: 80 }}>
                    <DrawerHeader>
                        <Heading size="lg">Menu</Heading>
                        <DrawerCloseButton>
                            <Icon as={CloseIcon} />
                        </DrawerCloseButton>
                    </DrawerHeader>
                    <DrawerBody>
                        <Text>This is the basic drawer component.</Text>
                    </DrawerBody>
                    {/* <DrawerFooter>
                    </DrawerFooter> */}
                </DrawerContent>
            </Drawer>
        </Pressable>
    )
}