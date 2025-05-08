import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import axios, { AxiosError } from "axios";

// Define types for API response
interface LoginResponse {
  success: boolean;
  message?: string;
}

function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.post<LoginResponse>(
        `${apiUrl}/api/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true, // Important to allow cookies to be set by the backend
        }
      );

      // Check if login was successful based on the success flag
      if (response.data.success) {
        // Redirect to dashboard on successful login
        navigate("/");
      } else {
        // If the backend returns success: false, show the error message
        setError(response.data.message || "Authentication failed. Please try again.");
      }
    } catch (err) {
      const error = err as AxiosError<LoginResponse>;
      // Handle network or server errors
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx
        setError(error.response.data.message || "Login failed. Please check your credentials.");
      } else if (error.request) {
        // The request was made but no response was received
        setError("Unable to connect to the server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request
        setError("An error occurred. Please try again later.");
      }
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
                src="/logo1new.png"
                alt="Company Logo"
                className="h-16 w-auto"
              />
            </div>

            <h1 className="text-3xl text-custom-blue2 mb-8 ubuntu">Welcome Back</h1>

            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                className="w-full p-4 bg-gray-100 bg-opacity-70"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
              />
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full p-4 bg-gray-100 bg-opacity-70"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(!!checked)}
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  {/* <Link
                    to="/reset-password"
                    className="text-sm text-gray-600 hover:underline"
                  >
                    Forgot Password
                  </Link> */}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full p-6 bg-custom-blue2 hover:bg-slate-800 text-white font-semibold text-lg mt-4"
                disabled={loading}
              >
                {loading ? "Logging in..." : "LOGIN"}
              </Button>
            </form>

            <div className="text-center text-gray-600 mt-4">
              Don't have an account?
              <Link to="/signup" className="ml-1 text-gray-800 hover:underline">
                Signup
              </Link>
            </div>
            <div className="text-center italic text-gray-700 mt-4">
              Enjoy exploring new knowledge and
              <br />
              making the most of your learning journey!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;