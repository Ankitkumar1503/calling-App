import GradientButton from "@/component/UI/GradientButton";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { Image, Switch, Text, TextInput, View } from "react-native";
import GradientBackground from "../../component/UI/GradientBackground";
import { auth } from "../firebase/index";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load saved credentials on component mount
  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const rememberMe = await AsyncStorage.getItem('@remember_me');
      const savedEmail = await AsyncStorage.getItem('@saved_email');
      
      if (rememberMe === 'true' && savedEmail) {
        setEmail(savedEmail);
        setRemember(true);
      }
    } catch (error) {
      console.log('Error loading saved credentials:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      console.log("Login successful:", userCredential.user.uid);

      // Handle "Remember Me" functionality
      if (remember) {
        await AsyncStorage.multiSet([
          ['@remember_me', 'true'],
          ['@saved_email', email.trim()]
        ]);
      } else {
        await AsyncStorage.multiRemove(['@remember_me', '@saved_email']);
      }

      // Clear form
      setPassword("");
      
      // Navigate to the correct dialpad route
      // Check your file structure and use the correct path
      // If your file is named dialPad.tsx, use 'dialPad'
      // If your file is named dialpad.tsx, use 'dialpad'
      router.replace('/apps/tabs/dialPad');
      
    } catch (error: any) {
      console.error("Login error:", error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (code: string) => {
    switch (code) {
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/invalid-credential":
        return "Invalid email or password";
      case "auth/user-disabled":
        return "This account has been disabled";
      case "auth/user-not-found":
        return "No account found with this email";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/too-many-requests":
        return "Too many failed attempts. Try again later";
      case "auth/network-request-failed":
        return "Network error. Please check your connection";
      case "auth/weak-password":
        return "Password should be at least 6 characters";
      default:
        return "Login failed. Please try again";
    }
  };

  // Clear error when user starts typing
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (error) setError("");
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (error) setError("");
  };

  return (
    <GradientBackground className="flex-1 px-8 pt-0 justify-center">
      <Image
        source={require("../../assets/images/logo.png")}
        className="w-64 h-64 self-center"
      />

      <Text className="text-white text-3xl mb-4">Sign in</Text>

      {error ? (
        <View className="bg-red-500/20 p-3 rounded-lg mb-4 border border-red-500/30">
          <Text className="text-red-400 text-center">{error}</Text>
        </View>
      ) : null}

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
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          selectionColor="#ffffff"
          style={{ padding: 0, margin: 0, minHeight: 20 }}
          editable={!loading}
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
          onChangeText={handlePasswordChange}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="password"
          selectionColor="#ffffff"
          style={{ padding: 0, margin: 0, minHeight: 20 }}
          editable={!loading}
        />
      </View>

      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center">
          <Switch
            value={remember}
            onValueChange={setRemember}
            trackColor={{ false: "#777", true: "#3346a8" }}
            thumbColor="#fff"
            disabled={loading}
          />
          <Text className="text-white ml-2">Remember Me</Text>
        </View>
        <Link href="/auth/forgotPassword">
          <Text className="text-blue-400 text-sm">Forgot Password?</Text>
        </Link>
      </View>

      <GradientButton
        className="rounded-xl"
        title={loading ? "SIGNING IN..." : "SIGN IN"}
        disabled={!email || !password || loading}
        onPress={handleLogin}
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

LoginScreen.options = {
  headerShown: false,
};