import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useCall } from '../contexts/CallContext';

const CallScreen = ({ phoneNumber, onEndCall }: { phoneNumber: string, onEndCall: () => void }) => {
  const { 
    callStatus, 
    isMuted, 
    isOnSpeaker, 
    toggleMute, 
    toggleSpeaker, 
    endCall,
    activeCall
  } = useCall();
  
  const [timer, setTimer] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (callStatus === 'Connected') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    endCall();
    onEndCall();
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-800">
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
      <View className="flex-1 justify-center items-center p-6">
        {/* Call Status and Number */}
        <View className="items-center mb-10">
          <Text className="text-white text-2xl font-semibold">{phoneNumber}</Text>
          <Text className="text-gray-400 text-lg mt-2">{callStatus}</Text>
          {callStatus === 'Connected' && (
            <Text className="text-gray-400 text-lg mt-1">{formatTime(timer)}</Text>
          )}
        </View>
        
        {/* Call Controls */}
        <View className="flex-row justify-center space-x-8 mb-10">
          {/* Mute Button */}
          <TouchableOpacity 
            className="items-center"
            onPress={toggleMute}
            disabled={!activeCall}
          >
            <View className={`w-16 h-16 rounded-full items-center justify-center ${isMuted ? 'bg-red-500' : 'bg-slate-700'}`}>
              <Feather name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
            </View>
            <Text className="text-white mt-2">Mute</Text>
          </TouchableOpacity>
          
          {/* Speaker Button */}
          <TouchableOpacity 
            className="items-center"
            onPress={toggleSpeaker}
            disabled={!activeCall}
          >
            <View className={`w-16 h-16 rounded-full items-center justify-center ${isOnSpeaker ? 'bg-green-500' : 'bg-slate-700'}`}>
              <Feather name="speaker" size={24} color="white" />
            </View>
            <Text className="text-white mt-2">Speaker</Text>
          </TouchableOpacity>
        </View>
        
        {/* End Call Button */}
        <TouchableOpacity 
          className="w-20 h-20 bg-red-500 rounded-full items-center justify-center"
          onPress={handleEndCall}
        >
          <Feather name="phone-off" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CallScreen;