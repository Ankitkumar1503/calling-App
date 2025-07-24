// app/tabs/_layout.tsx
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth } from '../firebase'; // Adjust path as needed

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.70; // 75% of screen width

const SlideDrawer = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await signOut(auth);
              console.log('User logged out successfully');
              onClose();
              // Navigation to login screen will be handled by auth state listener
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert(
                'Error',
                'Failed to logout. Please try again.',
                [{ text: 'OK' }]
              );
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Drawer */}
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: DRAWER_WIDTH,
            backgroundColor: '#1e293b',
            transform: [{ translateX: slideAnim }],
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 2, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
          }}
          onStartShouldSetResponder={() => true}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
            
            {/* Header */}
            <View className="px-6 py-6 border-b border-slate-600">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-white text-xl font-bold">Menu</Text>
                  <Text className="text-gray-400 text-sm mt-1">Welcome back!</Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  className="p-2 rounded-full bg-slate-700"
                >
                  <Feather name="x" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Empty space to push logout to bottom */}
            <View className="flex-1" />

            {/* Logout Button */}
            <View className="px-6 py-4 border-t border-slate-600">
              <TouchableOpacity
                className="flex-row items-center justify-center py-3"
                onPress={handleLogout}
                activeOpacity={0.7}
                disabled={isLoggingOut}
              >
                <Feather 
                  name={isLoggingOut ? "loader" : "log-out"} 
                  size={18} 
                  color={isLoggingOut ? "#9ca3af" : "#ef4444"} 
                />
                <Text className={`text-base font-medium ml-3 ${
                  isLoggingOut ? 'text-gray-400' : 'text-red-500'
                }`}>
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const CustomHeader = ({ onMenuPress }) => {
  return (
    <SafeAreaView style={{ backgroundColor: '#1e293b' }}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      <View className="flex-row items-center justify-between px-4 py-1 bg-slate-800 border-b border-slate-700">
        <TouchableOpacity
          onPress={onMenuPress}
          className="p-2 rounded-lg bg-slate-800"
          activeOpacity={0.7}
        >
          <Feather name="menu" size={24} color="#ffffff" />
        </TouchableOpacity>
        
        {/* You can add a title or logo here if needed */}
        <View className="flex-1 items-center">
          <Text className="text-white text-lg font-semibold">
            {/* App title or leave empty */}
          </Text>
        </View>
        
        {/* Right side placeholder for balance */}
        <View className="w-10" />
      </View>
    </SafeAreaView>
  );
};

export default function TabsLayout() {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  return (
    <>
      {/* Custom Header */}
      <CustomHeader onMenuPress={openDrawer} />
      
      {/* Slide Drawer */}
      <SlideDrawer visible={drawerVisible} onClose={closeDrawer} />
      
      {/* Tabs */}
      <Tabs
        screenOptions={{
          headerShown: false, // Keep this false since we have custom header
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarStyle: {
            backgroundColor: '#0f172a',
            borderTopColor: '#334155',
            height: 70,
            paddingBottom: 12,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 2,
          },
          tabBarIconStyle: {
            marginBottom: 2,
          },
        }}
      >
        <Tabs.Screen
          name="tabs/dialPad"
          options={{
            title: 'Keypad',
            tabBarIcon: ({ color, size = 24 }) => (
              <Feather name="grid" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tabs/recent"
          options={{
            title: 'Recent',
            tabBarIcon: ({ color, size = 24 }) => (
              <Feather name="clock" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tabs/leads"
          options={{
            title: 'Leads',
            tabBarIcon: ({ color, size = 24 }) => (
              <Feather name="users" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tabs/task"
          options={{
            title: 'Tasks',
            tabBarIcon: ({ color, size = 24 }) => (
              <Feather name="check-square" size={20} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}