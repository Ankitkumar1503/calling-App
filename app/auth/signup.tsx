import GradientBackground from "@/component/UI/GradientBackground";
import GradientButton from "@/component/UI/GradientButton";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { db } from "../firebase/index"; // Make sure you have this export

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Save additional user data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
      });

      router.replace("/(tabs)/dialpad");
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (code: string) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "Email already in use";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/weak-password":
        return "Password is too weak";
      default:
        return "Signup failed. Please try again";
    }
  };

  return (
    <GradientBackground className="flex-1 bg-[#0c1b2a] px-6 justify-center">
      <Text className="text-white text-2xl font-bold mb-8">Sign up</Text>

      {error ? (
        <View className="bg-red-500/20 p-3 rounded-lg mb-4">
          <Text className="text-red-400 text-center">{error}</Text>
        </View>
      ) : null}

      {/* Full Name Input */}
      <View className="flex-row items-center bg-[#1e2a38] px-4 py-3 rounded-xl mb-4">
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
        />
      </View>

      {/* Email Input */}
      <View className="flex-row items-center bg-[#1e2a38] px-4 py-3 rounded-xl mb-4">
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
        />
      </View>

      {/* Password Input */}
      <View className="flex-row items-center bg-[#1e2a38] px-4 py-3 rounded-xl mb-4">
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="white"
          style={{ marginRight: 12 }}
        />
        <TextInput
          className="flex-1 text-white text-base"
          placeholder="Your password (min 6 characters)"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Confirm Password Input */}
      <View className="flex-row items-center bg-[#1e2a38] px-4 py-3 rounded-xl mb-6">
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
        />
      </View>

      <GradientButton
        className="rounded-xl"
        title={loading ? "CREATING ACCOUNT..." : "SIGN UP"}
        disabled={!name || !email || !password || !confirmPassword || loading}
        onPress={handleSignup}
      />

      <View className="flex-row absolute bottom-0 left-0 right-0 items-center mb-16 justify-center">
        <Text className="text-white">Don't have an account? </Text>
        <Link href="/auth/signup">
          <Text className="text-blue-400 font-semibold">Sign up</Text>
        </Link>
      </View>
    </GradientBackground>
  );
}
