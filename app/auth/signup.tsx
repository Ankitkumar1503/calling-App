import GradientBackground from "@/component/UI/GradientBackground";
import GradientButton from "@/component/UI/GradientButton";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //   const handleSignup = () => {
  //     // TODO: Handle signup logic
  //     router.replace('/(tabs)/dialpad'); // or redirect to login
  //   };

  return (
    <GradientBackground className="flex-1 bg-[#0c1b2a] px-6 justify-center">
      <Text className="text-white text-2xl font-bold mb-8">Sign up</Text>

      {/* Full Name Input */}
      <View className="flex-row items-center bg-[#1e2a38] px-4 py-5 rounded-xl mb-4">
        <Ionicons
          name="person-outline"
          size={20}
          color="white"
          style={{ marginRight: 12 }}
        />
        <TextInput
          className="flex-1 text-white text-base"
          placeholder="Full name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
          selectionColor="#ffffff"
          style={{
            padding: 0,
            margin: 0,
            minHeight: 20,
          }}
        />
      </View>

      {/* Email Input */}
      <View className="flex-row items-center bg-[#1e2a38] px-4 py-5 rounded-xl mb-4">
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

      {/* Password Input */}
      <View className="flex-row items-center bg-[#1e2a38] px-4 py-5 rounded-xl mb-4">
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="white"
          style={{ marginRight: 12 }}
        />
        <TextInput
          className="flex-1 text-white text-base"
          placeholder="Your password"
          placeholderTextColor="#aaa"
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

      {/* Confirm Password Input */}
      <View className="flex-row items-center bg-[#1e2a38] px-4 py-5 rounded-xl mb-6">
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="white"
          style={{ marginRight: 12 }}
        />
        <TextInput
          className="flex-1 text-white text-base"
          placeholder="Confirm password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
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
        title="SIGN UP"
        disabled={!name || !email || !password || !confirmPassword}
        // onPress={handleLogin}
      />

      <View className="flex-row absolute bottom-0 left-0 right-0 items-center mb-16 justify-center">
        <Text className="text-white">Already have an account? </Text>
        <Link href="./login">
          <Text className="text-blue-400 font-semibold">Sign in</Text>
        </Link>
      </View>
    </GradientBackground>
  );
}
