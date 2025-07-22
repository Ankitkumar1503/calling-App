import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const RecentScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Recent contacts data
  const recentContacts = [
    { id: "1", name: "Sophia Carter", number: "555-123-4567" },
    { id: "2", name: "Ethan Bennett", number: "555-987-6543" },
    { id: "3", name: "Owen Thompson", number: "555-246-8013" },
    { id: "4", name: "Chloe Hayes", number: "555-135-7911" },
    { id: "5", name: "Caleb Mitchell", number: "555-369-2580" },
    { id: "6", name: "Emma Reynolds", number: "555-741-8520" },
    { id: "7", name: "Oliver Harper", number: "555-963-2587" },
    { id: "8", name: "Ava Foster", number: "555-159-3570" },
    { id: "9", name: "Lucas Parker", number: "555-753-9510" },
    { id: "10", name: "Isabella Bennett", number: "555-357-1590" },
    { id: "11", name: "Sophia Carter", number: "555-123-4567" },
  ];

  const handleCall = (contact) => {
    console.log("Calling:", contact.name, contact.number);
    // Implement call functionality
  };

  const filteredContacts = recentContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.number.includes(searchQuery)
  );

  const renderContact = ({ item }) => (
    <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-700/30">
      <View className="flex-1">
        <Text className="text-white text-base font-medium">{item.name}</Text>
        <Text className="text-gray-400 text-sm mt-1">{item.number}</Text>
      </View>
      <TouchableOpacity className="p-2" onPress={() => handleCall(item)}>
        <Feather name="phone" size={20} color="#9ca3af" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-800">
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />

      {/* Search Bar */}
      <View className="mx-4 my-4">
        <View className="flex-row items-center bg-slate-700 rounded-lg px-4 py-2">
          <Feather name="search" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 text-white ml-3 text-base"
            placeholder="Search contact"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Recent Contacts List */}
      <FlatList
        data={filteredContacts}
        renderItem={renderContact}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

export default RecentScreen;
