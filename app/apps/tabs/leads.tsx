import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from '../../providers/AuthProvider';
import { csvService } from '../../services/csvService';

const LeadsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  // Load leads on component mount
  useEffect(() => {
    if (user) {
      loadLeads();
    }
  }, [user]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const userLeads = await csvService.getUserLeads(user.uid);
      setLeads(userLeads);
    } catch (error) {
      console.error('Error loading leads:', error);
      Alert.alert('Error', 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeads();
    setRefreshing(false);
  };

  const handleUploadLeads = () => {
    Alert.alert("Upload Leads", "Choose how you want to upload leads:", [
      { text: "From CSV File", onPress: () => handleCSVUpload() },
      { text: "From Contacts", onPress: () => handleContactsUpload() },
      { text: "Manual Entry", onPress: () => handleManualEntry() },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleCSVUpload = async () => {
    try {
      // Pick CSV file
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'application/csv', 'text/comma-separated-values', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        // Validate file type
        const fileName = file.name.toLowerCase();
        if (!fileName.endsWith('.csv') && !fileName.endsWith('.txt')) {
          Alert.alert('Invalid File', 'Please select a CSV file (.csv or .txt)');
          return;
        }

        setUploading(true);

        try {
          // Process CSV and save to Firestore
          const result = await csvService.uploadAndProcessCSV(
            file.uri,
            file.name,
            user.uid
          );

          // Show success message
          Alert.alert(
            'Success!', 
            `Successfully imported ${result.leadsCount} leads from ${result.fileName}`,
            [
              {
                text: 'OK',
                onPress: () => loadLeads() // Refresh the leads list
              }
            ]
          );

        } catch (error) {
          console.error('CSV upload error:', error);
          Alert.alert('Error', error.message || 'Failed to process CSV file');
        }
      }
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('Error', 'Failed to pick file');
    } finally {
      setUploading(false);
    }
  };

  const handleContactsUpload = () => {
    console.log("Contacts upload selected");
    Alert.alert('Coming Soon', 'Contacts upload will be available soon!');
  };

  const handleManualEntry = () => {
    // Simple manual entry with alert inputs (you can create a proper form component)
    Alert.prompt(
      'Add Lead',
      'Enter lead name:',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Next',
          onPress: (name) => {
            if (name && name.trim()) {
              Alert.prompt(
                'Add Lead',
                'Enter phone number:',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel'
                  },
                  {
                    text: 'Add Lead',
                    onPress: async (phone) => {
                      try {
                        await csvService.addLead(
                          { 
                            name: name.trim(), 
                            phone: phone || '',
                            location: '',
                            city: ''
                          },
                          user.uid
                        );
                        loadLeads();
                        Alert.alert('Success', 'Lead added successfully!');
                      } catch (error) {
                        Alert.alert('Error', 'Failed to add lead');
                      }
                    }
                  }
                ]
              );
            }
          }
        }
      ]
    );
  };

  const handleCall = (lead) => {
    console.log("Calling:", lead.name, lead.phone);
    Alert.alert(
      'Call Lead',
      `Call ${lead.name || 'Unknown'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            // Here you would integrate with a calling service
            // For now, just show the phone number
            Alert.alert('Phone Number', lead.phone || 'No phone number available');
          }
        }
      ]
    );
  };

  const handleLeadLongPress = (lead) => {
    Alert.alert(
      'Lead Options',
      `What would you like to do with ${lead.name || 'this lead'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => handleCall(lead)
        },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => confirmDeleteLead(lead)
        }
      ]
    );
  };

  const confirmDeleteLead = (lead) => {
    Alert.alert(
      'Delete Lead',
      `Are you sure you want to delete ${lead.name || 'this lead'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await csvService.deleteLead(lead.id);
              loadLeads();
              Alert.alert('Success', 'Lead deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete lead');
            }
          }
        }
      ]
    );
  };

  const filteredLeads = leads.filter(
    (lead) =>
      (lead.name && lead.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.location && lead.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.city && lead.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.phone && lead.phone.includes(searchQuery)) ||
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderLead = ({ item }) => (
    <TouchableOpacity 
      onPress={() => handleCall(item)}
      onLongPress={() => handleLeadLongPress(item)}
      className="flex-row items-center px-6 py-4 border-b border-slate-700/30"
    >
      {/* Initial Circle */}
      <View className="w-12 h-12 bg-slate-600 rounded-full items-center justify-center mr-4">
        <Text className="text-white text-lg font-semibold">
          {item.initial || item.name?.charAt(0)?.toUpperCase() || '?'}
        </Text>
      </View>

      {/* Lead Info */}
      <View className="flex-1">
        <Text className="text-white text-base font-medium">
          {item.name || 'Unknown'}
        </Text>
        <Text className="text-gray-400 text-sm mt-1">
          {item.location || item.city || 'No location'}
        </Text>
        {item.email && (
          <Text className="text-gray-500 text-xs mt-1">
            {item.email}
          </Text>
        )}
        {item.source && (
          <View className="flex-row items-center mt-1">
            <View className={`w-2 h-2 rounded-full mr-2 ${
              item.source === 'csv_upload' ? 'bg-green-400' : 
              item.source === 'manual_entry' ? 'bg-blue-400' : 'bg-gray-400'
            }`} />
            <Text className="text-gray-500 text-xs">
              {item.source.replace('_', ' ')}
            </Text>
          </View>
        )}
      </View>

      {/* Right Side Info */}
      <View className="items-end">
        <Text className="text-gray-400 text-sm">
          {item.city || item.location || ''}
        </Text>
        <Text className="text-gray-400 text-sm mt-1">
          {item.phone || 'No phone'}
        </Text>
        <Feather name="phone" size={16} color="#60a5fa" className="mt-1" />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-6">
      <Feather name="users" size={64} color="#64748b" />
      <Text className="text-gray-400 text-lg mt-4 text-center">
        {searchQuery ? 'No leads match your search' : 'No leads found'}
      </Text>
      <Text className="text-gray-500 text-sm mt-2 text-center">
        {searchQuery ? 'Try a different search term' : 'Upload a CSV file or add leads manually to get started'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          onPress={handleUploadLeads}
          className="bg-blue-600 px-6 py-3 rounded-lg mt-6"
        >
          <Text className="text-white font-medium">Add Leads</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-800">
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <View>
          <Text className="text-white text-xl font-semibold">Leads</Text>
          {leads.length > 0 && (
            <Text className="text-gray-400 text-sm">
              {filteredLeads.length} of {leads.length} leads
            </Text>
          )}
        </View>
        <TouchableOpacity 
          onPress={handleUploadLeads}
          disabled={uploading}
          className="flex-row items-center bg-blue-600 px-3 py-2 rounded-lg"
        >
          {uploading ? (
            <>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text className="text-white ml-2 text-sm">Processing...</Text>
            </>
          ) : (
            <>
              <Feather name="plus" size={20} color="#ffffff" />
              <Text className="text-white ml-2 text-sm">Add</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {leads.length > 0 && (
        <View className="mx-4 mb-4">
          <View className="flex-row items-center bg-slate-700 rounded-lg px-4 py-2">
            <Feather name="search" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 text-white ml-3 text-base"
              placeholder="Search by name, location, phone, or email..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Feather name="x" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Loading State */}
      {loading && !refreshing && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#60a5fa" />
          <Text className="text-gray-400 mt-4">Loading leads...</Text>
        </View>
      )}

      {/* Leads List */}
      {!loading && (
        <FlatList
          data={filteredLeads}
          renderItem={renderLead}
          keyExtractor={(item) => item.id}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingBottom: 20,
            flexGrow: 1 
          }}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#60a5fa']}
              tintColor="#60a5fa"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default LeadsScreen;