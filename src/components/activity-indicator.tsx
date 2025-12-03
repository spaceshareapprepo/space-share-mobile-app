import { useThemeColor } from "@/hooks/use-theme-color";
import { ActivityIndicator, View } from "react-native";


export default function ActivityIndicatorComponent() {
    const tintColor = useThemeColor({}, "tint");
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator 
            size="large"
            color={tintColor} />
        </View>
    );
}