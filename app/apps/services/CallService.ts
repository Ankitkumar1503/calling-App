import axios from "axios";

const API_BASE = "https://3205bfbcc3d7.ngrok-free.app";

export const getTwilioToken = async (identity: string): Promise<string> => {
  try {
    const res = await axios.post(`${API_BASE}/token`, { identity });
    return res.data.token;
  } catch (error) {
    console.error('Error getting Twilio token:', error);
    throw new Error('Failed to get call token');
  }
};

export const makeCall = async (to: string) => {
  try {
    const res = await axios.post(`${API_BASE}/call`, { to });
    return res.data;
  } catch (error) {
    console.error('Error making call request:', error);
    throw new Error('Failed to initiate call');
  }
};