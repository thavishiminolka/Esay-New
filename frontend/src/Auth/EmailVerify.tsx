import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "../utils/auth";
import { toast } from "react-toastify";

function EmailVerify() {
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Assuming userId is stored in localStorage or fetched from /is-auth
      const userId = localStorage.getItem("userId") || ""; // Replace with actual userId fetching logic
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }
      const response = await verifyEmail(otp, userId);
      if (response.success) {
        toast.success(response.message || "Email verified successfully");
        navigate("/");
      } else {
        setError(response.message || "Failed to verify email");
        toast.error(response.message || "Failed to verify email");
      }
    } catch (err: any) {
      const message = err.message || "An error occurred. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/background.png')] bg-cover bg-center bg-fixed">
        <div className="absolute inset-0"></div>
      </div>

      <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl">
          <div className="w-full md:w-1/2 h-80 md:h-auto relative">
            <img
              src="/images/login.png"
              alt="Japanese temple with cherry blossoms"
              className="w-full h-80 md:h-auto object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center bg-gradient-to-b from-pink-200/80 to-orange-500/30 backdrop-blur-sm">
            <div className="flex justify-center mb-8">
              <img
                src="/images/logoBlue.png"
                alt="Company Logo"
                className="h-16 w-auto"
              />
            </div>

            <h1 className="text-3xl text-custom-blue2 mb-8 ubuntu">Verify Your Email</h1>

            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter OTP"
                className="w-full p-4 bg-gray-100 bg-opacity-70"
                value={otp}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="w-full p-6 bg-custom-blue2 hover:bg-slate-800 text-white font-semibold text-lg mt-4"
                disabled={loading}
              >
                {loading ? "Verifying..." : "VERIFY"}
              </Button>
            </form>

            <div className="text-center text-gray-600 mt-4">
              Didn't receive an OTP?{" "}
              <button
                className="text-gray-800 hover:underline"
                onClick={() => navigate("/")} // Trigger OTP resend via Navbar
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerify;