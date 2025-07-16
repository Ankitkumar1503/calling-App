import GradientButton from "@/component/UI/GradientButton";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Image, Switch, Text, TextInput, View } from "react-native";
import GradientBackground from "../../component/UI/GradientBackground";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  //   const handleLogin = () => {
  //     // TODO: Replace with real auth logic
  //     router.replace('/(tabs)/dialpad');
  //   };

  return (
    <GradientBackground className="flex-1 px-8 justify-center">
      <Image
        source={require("../../assets/images/logo.png")}
        className="w-32 h-32 self-center mb-4"
      />
      <Text className="text-white text-5xl text-center font-bold">LOGO</Text>

      <Text className="text-white text-3xl mb-4">Sign in</Text>

      <View className="flex-row items-center bg-[#1e2a38] px-4 py-5 rounded-xl mb-4">
        <Ionicons
          name="mail-outline"
          size={20}
          color="white"
          style={{ marginRight: 8 }}
        />
        <TextInput
          className="flex-1 text-white text-base"
          placeholder="abc@email.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          selectionColor="#ffffff"
          style={{
            padding: 0,
            margin: 0,
            minHeight: 20,
          }}
        />
      </View>

      <View className="flex-row items-center bg-[#1e2a38] px-4 py-5 rounded-xl mb-2">
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="white"
          style={{ marginRight: 12 }}
        />
        <TextInput
          className="flex-1 text-white text-base"
          placeholder="Your password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          selectionColor="#ffffff"
          style={{
            padding: 0,
            margin: 0,
            minHeight: 20,
          }}
        />
      </View>

      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center">
          <Switch
            value={remember}
            onValueChange={setRemember}
            trackColor={{ false: "#777", true: "#3346a8" }}
            thumbColor="#fff"
          />
          <Text className="text-white ml-2">Remember Me</Text>
        </View>
        <Link href="./forgotPassword">
          <Text className="text-blue-400 text-sm">Forgot Password?</Text>
        </Link>
      </View>

      {/* <Pressable
        className="bg-blue-600 rounded-xl py-4 mb-4"
        // onPress={handleLogin}
      >
        <Text className="text-white text-center font-semibold text-base">SIGN IN →</Text>
      </Pressable> */}
      <GradientButton
        className="rounded-xl"
        title="SIGN IN"
        disabled={!email || !password}
        // onPress={handleLogin}
      />

      <View className="flex-row absolute bottom-0 left-0 right-0 items-center mb-16 justify-center">
        <Text className="text-white">Don’t have an account? </Text>
        <Link href="./signup">
          <Text className="text-blue-400 font-semibold">Sign up</Text>
        </Link>
      </View>
    </GradientBackground>
  );
}

LoginScreen.options = {
  headerShown: false,
};
