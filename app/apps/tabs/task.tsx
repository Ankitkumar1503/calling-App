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

const TaskScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Tasks data
  const [tasksData, setTasksData] = useState([
    {
      id: "1",
      title: "Follow up with Sophia carter",
      phone: "555-123-4567",
      time: "1 min ago",
      completed: false,
    },
    {
      id: "2",
      title: "Send an email to Ethan Bennett",
      phone: "555-987-6543",
      time: "1 min ago",
      completed: false,
    },
    {
      id: "3",
      title: "Schedule meeting with owen Thom...",
      phone: "555-357-1590",
      time: "1 min ago",
      completed: false,
    },
    {
      id: "4",
      title: "Call chloe Hayes",
      phone: "555-246-8013",
      time: "1 min ago",
      completed: false,
    },
    {
      id: "5",
      title: "Update note with for Caleb Mitchell",
      phone: "555-369-2580",
      time: "1 min ago",
      completed: false,
    },
    {
      id: "6",
      title: "Reviwe Contract with Emma Reynolds",
      phone: "555-741-8520",
      time: "1 min ago",
      completed: false,
    },
    {
      id: "7",
      title: "Follow up with Sophia carter",
      phone: "555-159-3570",
      time: "1 min ago",
      completed: false,
    },
    {
      id: "8",
      title: "Follow up with Sophia carter",
      phone: "555-753-9510",
      time: "1 min ago",
      completed: false,
    },
  ]);

  const handleTaskToggle = (taskId) => {
    setTasksData((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = tasksData.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.phone.includes(searchQuery)
  );

  const renderTask = ({ item }) => (
    <View className="flex-row items-center px-6 py-4 border-b border-slate-700/30">
      {/* Checkbox */}
      <TouchableOpacity
        className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${
          item.completed
            ? "bg-blue-500 border-blue-500"
            : "border-slate-400 bg-transparent"
        }`}
        onPress={() => handleTaskToggle(item.id)}
      >
        {item.completed && <Feather name="check" size={16} color="white" />}
      </TouchableOpacity>

      {/* Task Info */}
      <View className="flex-1">
        <Text
          className={`text-base font-medium ${
            item.completed ? "text-gray-500 line-through" : "text-white"
          }`}
        >
          {item.title}
        </Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-gray-400 text-sm">{item.phone}</Text>
          <Text className="text-gray-400 text-sm ml-4">{item.time}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-800">
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />

      {/* Header with blue underline */}
      {/* <View className="px-6 py-4 justify-cneter items-center border-b ">
        <Text className="text-white text-xl font-semibold">Task</Text>
      </View> */}

      {/* Search Bar with blue border */}
      <View className="mx-4 my-4">
        <View className="flex-row items-center bg-slate-700 rounded-lg px-4 py-2 ">
          <Feather name="search" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 text-white ml-3 text-base"
            placeholder="Search Tasks"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Tasks List */}
      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

export default TaskScreen;
