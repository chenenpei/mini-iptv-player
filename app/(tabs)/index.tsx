import { View } from "react-native";
import { ChannelList } from "@components/channel";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      <ChannelList />
    </View>
  );
}
