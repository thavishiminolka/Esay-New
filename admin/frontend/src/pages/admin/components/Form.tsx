
import React, { useState } from "react";
import axios from "axios";
import { FormProps } from "../type";
import { X } from "lucide-react";

const Form: React.FC<FormProps> = ({ type }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretId, setSecretId] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<
    {
      id: string;
      type: "success" | "error";
      message: string;
    }[]
  >([]);

  // Show notification
  const showNotification = (type: "success" | "error", message: string) => {
    console.log("Showing notification:", { type, message });
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification = { id, type, message };
    setNotifications((prev) => [...prev, newNotification]);
    setTimeout(() => removeNotification(id), 5000);
  };

  // Remove notification
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === "signup") {
        const expectedSecretId = "EPS2025_SECRET_789";
        if (!secretId || secretId !== expectedSecretId) {
          showNotification("error", "Invalid or missing Secret ID");
          setLoading(false);
          return;
        }
      }
      const apiUrl = import.meta.env.VITE_API_URL;
      const endpoint =
        type === "login" ? "/api/admin/login" : "/api/admin/signup";
      const payload =
        type === "login" ? { email, password } : { email, password, secretId };
      await axios.post(`${apiUrl}${endpoint}`, payload);

      if (type === "login") {
        window.location.href = "/dashboard";
      } else {
        showNotification(
          "success",
          "Signup successful! Redirecting to login..."
        );
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000); // Delay redirect to show notification
      }
    } catch (err: any) {
      console.error(`${type} error:`, err.response?.data);
      showNotification(
        "error",
        err.response?.data?.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center ubuntu">
          {type === "login" ? "Admin Login" : "Admin Signup"}
        </h2>
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-md shadow-lg flex items-center justify-between font-ubuntu ${
                notification.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <span>{notification.message}</span>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-4"
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {type === "signup" && (
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="secretId">
                Secret ID
              </label>
              <input
                type="text"
                id="secretId"
                value={secretId}
                onChange={(e) => setSecretId(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Processing..." : type === "login" ? "Login" : "Signup"}
          </button>
        </form>
        <p className="mt-4 text-center">
          {type === "login" ? (
            <>
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-500 hover:underline">
                Signup
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Login
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Form;
