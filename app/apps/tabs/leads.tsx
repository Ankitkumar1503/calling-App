import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LeadsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Leads data
  const leadsData = [
    {
      id: "1",
      name: "Jenny Wilson",
      location: "San Diego, CA",
      city: "Phoenix, AZ",
      phone: "+1-403-498-3598",
      initial: "J",
    },
    {
      id: "2",
      name: "Esther Howard",
      location: "Los Angeles, CA",
      city: "Los Angeles, CA",
      phone: "+1-403-498-3598",
      initial: "E",
    },
    {
      id: "3",
      name: "Cody Fisher",
      location: "Salt Lake City, UT",
      city: "Salt Lake City, UT",
      phone: "+1-403-498-3598",
      initial: "C",
    },
    {
      id: "4",
      name: "Eleanor Pena",
      location: "Austin, TX",
      city: "Austin, TX",
      phone: "+1-403-498-3598",
      initial: "E",
    },
    {
      id: "5",
      name: "Robert Fox",
      location: "Honolulu, HI",
      city: "Honolulu, HI",
      phone: "+1-403-498-3598",
      initial: "R",
    },
    {
      id: "6",
      name: "Jane Cooper",
      location: "Dallas, TX",
      city: "Dallas, TX",
      phone: "+1-403-498-3598",
      initial: "J",
    },
    {
      id: "7",
      name: "Cody Fisher",
      location: "Jacksonville, FL",
      city: "Jacksonville, FL",
      phone: "+1-403-498-3598",
      initial: "C",
    },
    {
      id: "8",
      name: "Jenny Wilson",
      location: "San Diego, CA",
      city: "Phoenix, AZ",
      phone: "+1-403-498-3598",
      initial: "J",
    },
  ];

  const handleUploadLeads = () => {
    Alert.alert("Upload Leads", "Choose how you want to upload leads:", [
      { text: "From CSV File", onPress: () => handleCSVUpload() },
      { text: "From Contacts", onPress: () => handleContactsUpload() },
      { text: "Manual Entry", onPress: () => handleManualEntry() },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleCSVUpload = () => {
    console.log("CSV Upload selected");
    // Implement CSV upload functionality
  };

  const handleContactsUpload = () => {
    console.log("Contacts upload selected");
    // Implement contacts upload functionality
  };

  const handleManualEntry = () => {
    console.log("Manual entry selected");
    // Implement manual entry functionality
  };

  const handleCall = (lead) => {
    console.log("Calling:", lead.name, lead.phone);
    // Implement call functionality
  };

  const filteredLeads = leadsData.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery)
  );

  const renderLead = ({ item }) => (
    <View className="flex-row items-center px-6 py-4 border-b border-slate-700/30">
      {/* Initial Circle */}
      <View className="w-12 h-12 bg-slate-600 rounded-full items-center justify-center mr-4">
        <Text className="text-white text-lg font-semibold">{item.initial}</Text>
      </View>

      {/* Lead Info */}
      <View className="flex-1">
        <Text className="text-white text-base font-medium">{item.name}</Text>
        <Text className="text-gray-400 text-sm mt-1">{item.location}</Text>
      </View>

      {/* Right Side Info */}
      <View className="items-end">
        <Text className="text-gray-400 text-sm">{item.city}</Text>
        <Text className="text-gray-400 text-sm mt-1">{item.phone}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-800">
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Text className="text-white text-xl font-semibold">Leads</Text>
        <TouchableOpacity onPress={handleUploadLeads}>
          <Feather name="plus" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="mx-4 mb-4">
        <View className="flex-row items-center bg-slate-700 rounded-lg px-4 py-2">
          <Feather name="search" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 text-white ml-3 text-base"
            placeholder="Search leads"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Leads List */}
      <FlatList
        data={filteredLeads}
        renderItem={renderLead}
        keyExtractor={(item) => item.id}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

export default LeadsScreen;
