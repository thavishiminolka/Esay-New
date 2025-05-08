import axios from "axios";
//import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export const checkAuth = async (): Promise<boolean> => {
  try {
    const response = await api.get("/api/auth/is-auth");
    console.log("checkAuth response:", response.data);
    if (!response.data.success) {
      console.warn("checkAuth failed:", response.data.message);
    }
    return response.data.success;
  } catch (error: any) {
    console.error("checkAuth error:", error.response?.data || error.message);
    return false;
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    const response = await api.post("/api/auth/logout");
    return response.data.success;
  } catch (error) {
    return false;
  }
};

export const sendVerificationOTP = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post("/api/auth/send-verify-otp");
    return response.data;
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Failed to send verification OTP" };
  }
};

export const verifyEmail = async (otp: string, userId: string) => {
  const response = await fetch(`${apiUrl}/api/auth/Verify-account`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Send cookies (JWT token)
    body: JSON.stringify({ userId, otp }),
  });
  return response.json();
};

export const sendResetOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post("/api/auth/send-reset-otp", { email });
    return response.data;
  } catch (error) {
    return { success: false, message: "Failed to send reset OTP" };
  }
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post("/api/auth/reset-password", { email, otp, newPassword });
    return response.data;
  } catch (error) {
    return { success: false, message: "Failed to reset password" };
  }
};