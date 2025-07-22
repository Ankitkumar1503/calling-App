// app/tabs/_layout.tsx
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
            <Feather name="grid" size={20} color="#9ca3af" />
          ),
        }}
      />
      <Tabs.Screen
        name="tabs/recent"
        options={{
          title: 'Recent',
          tabBarIcon: ({ color, size = 24 }) => (
            <Feather name="clock" size={20} color="#9ca3af" />
          ),
        }}
      />
      <Tabs.Screen
        name="tabs/leads"
        options={{
          title: 'Leads',
          tabBarIcon: ({ color, size = 24 }) => (
            <Feather name="users" size={20} color="#9ca3af" />
          ),
        }}
      />
      <Tabs.Screen
        name="tabs/task"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size = 24 }) => (
            <Feather name="check-square" size={20} color="#9ca3af" />
          ),
        }}
      />
    </Tabs>
  );
}