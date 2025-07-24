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

const DialerScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialedNumber, setDialedNumber] = useState("");
  const [isKeypadVisible, setIsKeypadVisible] = useState(true);

  // Mock recent calls data
  const [recentCalls, setRecentCalls] = useState([
    { id: "1", name: "Sophia Carter", number: "555-123-4567", time: "1 min" },
    { id: "2", name: "Ethan Bennett", number: "555-987-6543", time: "1 min" },
    { id: "3", name: "Owen Thompson", number: "555-246-8013", time: "1 min" },
    { id: "4", name: "Chloe Hayes", number: "555-135-7911", time: "1 min" },
  ]);

  // Keypad data
  const keypadData = [
    { number: "1", letters: "" },
    { number: "2", letters: "ABC" },
    { number: "3", letters: "DEF" },
    { number: "4", letters: "GHI" },
    { number: "5", letters: "JKL" },
    { number: "6", letters: "MNO" },
    { number: "7", letters: "PQRS" },
    { number: "8", letters: "TUV" },
    { number: "9", letters: "WXYZ" },
  ];

  const handleKeyPress = (value) => {
    setDialedNumber((prev) => prev + value);
  };

  const addToRecentCalls = (number) => {
    const currentTime = new Date();
    const timeString = "Just now";

    // Check if number already exists in recent calls
    const existingCallIndex = recentCalls.findIndex(
      (call) => call.number === number
    );

    if (existingCallIndex !== -1) {
      // If exists, remove it from current position
      const existingCall = recentCalls[existingCallIndex];
      const updatedCalls = recentCalls.filter(
        (_, index) => index !== existingCallIndex
      );

      // Add it to the top with updated time
      const updatedCall = {
        ...existingCall,
        time: timeString,
        id: Date.now().toString(), // New ID to ensure re-render
      };

      setRecentCalls([updatedCall, ...updatedCalls]);
    } else {
      // If doesn't exist, create new entry
      const newCall = {
        id: Date.now().toString(),
        name: number, // Use number as name for unknown contacts
        number: number,
        time: timeString,
      };

      // Add to top of the list
      setRecentCalls([newCall, ...recentCalls]);
    }
  };

  const handleCall = () => {
    if (dialedNumber) {
      console.log("Calling:", dialedNumber);
      addToRecentCalls(dialedNumber);
      setDialedNumber(""); // Clear the dialed number after call
    }
  };

  const handleBackspace = () => {
    setDialedNumber((prev) => prev.slice(0, -1));
  };

  const handleScroll = () => {
    setIsKeypadVisible(false);
  };

  const handleShowKeypad = () => {
    setIsKeypadVisible(true);
  };

  const handleCallFromList = (number) => {
    setDialedNumber(number);
    setIsKeypadVisible(true);
  };

  const renderRecentCall = ({ item }) => (
    <View className="flex-row items-center justify-between px-6 py-3">
      <View className="flex-1">
        <Text className="text-white text-base font-medium">{item.name}</Text>
        <Text className="text-gray-400 text-sm">{item.number}</Text>
      </View>
      <View className="flex-row items-center">
        <Text className="text-gray-400 text-sm mr-3">{item.time}</Text>
        <TouchableOpacity
          className="p-2"
          onPress={() => handleCallFromList(item.number)}
        >
          <Feather name="phone" size={20} color="#10b981" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderKeypadButton = (item, index) => (
    <TouchableOpacity
      key={index}
      className="w-20 h-20 bg-slate-700 rounded-full items-center justify-center m-2"
      onPress={() => handleKeyPress(item.number)}
    >
      <Text className="text-white text-2xl font-light">{item.number}</Text>
      {item.letters && (
        <Text className="text-gray-400 text-xs mt-1">{item.letters}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-800">
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />

      {/* Header */}
      {/* <View className="px-4 py-2">
        <Text className="text-white text-lg font-semibold">Dialing</Text>
      </View> */}

      {/* Search Bar */}
      <View className="mx-4 mb-4 mt-4">
        <View className="flex-row items-center bg-slate-700 rounded-lg px-4 py-2">
          <Feather name="search" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 text-white ml-3 text-base"
            placeholder="Search number"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Recent Calls */}
      <FlatList
        data={recentCalls}
        renderItem={renderRecentCall}
        keyExtractor={(item) => item.id}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Keypad */}
      {isKeypadVisible && (
        <View className="bg-slate-900 px-4 py-6 border-t border-slate-700 rounded-t-3xl">
          {/* Dialed Number Display - Only show when there's a number */}
          {dialedNumber && (
            <View className="items-center pb-4">
              <Text className="text-white text-2xl font-light">
                {dialedNumber}
              </Text>
            </View>
          )}

          {/* First row: 1, 2, 3 */}
          <View className="flex-row justify-center gap-8">
            {keypadData
              .slice(0, 3)
              .map((item, index) => renderKeypadButton(item, index))}
          </View>

          {/* Second row: 4, 5, 6 */}
          <View className="flex-row justify-center gap-8">
            {keypadData
              .slice(3, 6)
              .map((item, index) => renderKeypadButton(item, index + 3))}
          </View>

          {/* Third row: 7, 8, 9 */}
          <View className="flex-row justify-center gap-8">
            {keypadData
              .slice(6, 9)
              .map((item, index) => renderKeypadButton(item, index + 6))}
          </View>

          {/* Fourth row: *, 0, # */}
          <View className="flex-row justify-center gap-8">
            <TouchableOpacity
              className="w-20 h-20 bg-slate-700 rounded-full items-center justify-center m-2"
              onPress={() => handleKeyPress("*")}
            >
              <Text className="text-white text-2xl font-light">*</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-20 h-20 bg-slate-700 rounded-full items-center justify-center m-2"
              onPress={() => handleKeyPress("0")}
            >
              <Text className="text-white text-2xl font-light">0</Text>
              <Text className="text-gray-400 text-xs mt-1">+</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-20 h-20 bg-slate-700 rounded-full items-center justify-center m-2"
              onPress={() => handleKeyPress("#")}
            >
              <Text className="text-white text-2xl font-light">#</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom row with call and backspace */}
          <View className="flex-row justify-center items-center gap-8 mt-4">
            <View className="w-20 h-20 m-2" />

            <TouchableOpacity
              className="w-20 h-20 bg-green-500 rounded-full items-center justify-center m-2"
              onPress={handleCall}
            >
              <Feather name="phone" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-20 h-20 items-center justify-center m-2"
              onPress={handleBackspace}
            >
              <Feather name="delete" size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!isKeypadVisible && (
        <TouchableOpacity
          className="absolute bottom-24 right-6 w-16 h-16 bg-green-500 rounded-full items-center justify-center shadow-lg"
          onPress={handleShowKeypad}
        >
          <Feather name="grid" size={24} color="white" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default DialerScreen;