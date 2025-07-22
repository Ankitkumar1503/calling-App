// components/CustomHeader.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

type CustomHeaderProps = {
  title?: string;
  showBack?: boolean;
};

export default function CustomHeader({ 
  title = '', 
  showBack = true 
}: CustomHeaderProps) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 50, // Adjust for status bar
      paddingBottom: 16,
      paddingHorizontal: 16,
      backgroundColor: '#0f172a', // Match your app's theme
    }}>
      {showBack && (
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )}
      
      {title && (
        <Text style={{
          color: 'white',
          fontSize: 20,
          fontWeight: 'bold',
        }}>
          {title}
        </Text>
      )}
    </View>
  );
}