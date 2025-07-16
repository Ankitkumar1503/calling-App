import GradientBackground from "@/component/UI/GradientBackground";
import GradientButton from "@/component/UI/GradientButton";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function forgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  // const handleSendReset = () => {
  //   // TODO: Send password reset request
  //   alert('Reset link sent!');
  //   router.replace('/(auth)/login');
  // };

  return (
    <GradientBackground className="flex-1 bg-[#0c1b2a] px-6 justify-center">
      <Text className="text-white text-2xl font-bold mb-2">
        Forget Password
      </Text>
      <Text className="text-gray-300 mb-6">
        Please enter your email address to request a password reset
      </Text>

      {/* Email Input with Icon */}
      <View className="flex-row items-center bg-[#1e2a38] px-4 py-5 rounded-xl mb-6">
        <Ionicons
          name="mail-outline"
          size={20}
          color="white"
          style={{ marginRight: 12 }}
        />
        <TextInput
          className="flex-1 text-white text-base"
          placeholder="abc@email.com"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
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

      <GradientButton
        className="rounded-xl"
        title="SEND"
        disabled={!email}
        // onPress={handleSendReset}
      />
    </GradientBackground>
  );
}

// export default forgotPassword;
