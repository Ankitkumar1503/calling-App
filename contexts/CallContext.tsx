// import { Call, Voice } from '@twilio/voice-react-native-sdk';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTwilioToken } from '../app/apps/services/CallService';

interface CallContextType {
  isCallInProgress: boolean;
  isConnected: boolean;
  callStatus: string;
  activeCall: Call | null;
  initiateCall: (to: string) => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
  toggleSpeaker: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) throw new Error('useCall must be used within a CallProvider');
  return context;
};

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [voice, setVoice] = useState<Voice | null>(null);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [callStatus, setCallStatus] = useState('Disconnected');

  useEffect(() => {
    const init = async () => {
      try {
        console.log('Initializing Twilio Voice SDK...');
        const token = await getTwilioToken('user_identity');
        const v = new Voice();

        // register for incoming calls
        await v.register(token);

        // handle incoming calls
        v.on('callInvite', (callInvite) => {
          console.log('Incoming call invite:', callInvite);
          callInvite.accept();
        });

        v.on('callConnected', (call) => {
          console.log('Call connected:', call);
          setActiveCall(call);
          setIsCallInProgress(true);
          setIsConnected(true);
          setCallStatus('Connected');
        });

        v.on('callDisconnected', () => {
          console.log('Call disconnected');
          setActiveCall(null);
          setIsCallInProgress(false);
          setIsConnected(false);
          setCallStatus('Disconnected');
        });

        setVoice(v);
        console.log('Twilio Voice initialized successfully');
      } catch (e) {
        console.error('Failed to init Twilio Voice SDK:', e);
      }
    };

    init();

    return () => {
      voice?.removeAllListeners();
    };
  }, []);

  const initiateCall = async (to: string) => {
    if (!voice) return;
    try {
      setCallStatus('Connecting...');
      const token = await getTwilioToken('user_identity');
      const call = await voice.connect(token, { params: { To: to } });
      setActiveCall(call);
      setIsCallInProgress(true);
    } catch (err) {
      console.error('Failed to initiate call:', err);
      setCallStatus('Failed');
    }
  };

  const endCall = async () => {
    if (activeCall) {
      await activeCall.disconnect();
      setActiveCall(null);
      setIsCallInProgress(false);
      setIsConnected(false);
      setCallStatus('Disconnected');
    }
  };

  const toggleMute = () => {
    if (activeCall) {
      activeCall.muted = !activeCall.muted;
    }
  };

  const toggleSpeaker = () => {
    if (activeCall) {
      activeCall.speakerOn = !activeCall.speakerOn;
    }
  };

  return (
    <CallContext.Provider
      value={{
        isCallInProgress,
        isConnected,
        callStatus,
        activeCall,
        initiateCall,
        endCall,
        toggleMute,
        toggleSpeaker,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
