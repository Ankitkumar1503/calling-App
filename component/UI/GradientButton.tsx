import { LinearGradient } from "expo-linear-gradient";
import { Pressable, PressableProps, Text } from "react-native";

interface Props extends PressableProps {
  title: string;
  loading?: boolean;
  disabled?: boolean;
}

export default function     ({ title, loading, disabled, ...props }: Props) {
  return (
    <Pressable
      className="rounded-xl overflow-hidden mb-4 opacity-100"
      disabled={disabled || loading}
      {...props}
    >
      <LinearGradient
        colors={['#1E3C72', '#2A5298']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="py-4 px-6 rounded-xl"
      >
        <Text className="text-white text-center font-semibold text-base">
          {loading ? 'Loading...' : title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}
