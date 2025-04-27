import { useState } from "react";

import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/background.png')] bg-cover bg-center">
        <div className="absolute inset-0 "></div>
      </div>

      {/* Content container */}
      <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl">
          {/* Left side - Temple Image */}
          <div className="w-full md:w-1/2 h-80 md:h-auto relative">
            <img
              src="/images/signup.png"
              alt="Japanese temple with cherry blossoms"
              className="w-full h-80 md:h-auto object-cover"
            />
          </div>

          {/* Right side - Form */}
          <div
            className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center 
                       bg-gradient-to-b from-pink-200/80 to-lime-600/20 
                       backdrop-blur-sm"
          >
            <div className="flex justify-center mb-8">
              <img
                src="/images/logoBlue.png"
                alt="Company Logo"
                className="h-16 w-auto"
              />
            </div>

            <h1 className="text-3xl  text-custom-blue2 mb-8 ubuntu">
              Create Your Account
            </h1>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    placeholder="First Name"
                    className="w-full p-4 bg-gray-100 bg-opacity-70"
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    className="w-full p-4 bg-gray-100 bg-opacity-70"
                  />
                </div>
              </div>

              <Input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-4 bg-gray-100 bg-opacity-70"
              />

              <Input
                type="email"
                placeholder="Email"
                className="w-full p-4 bg-gray-100 bg-opacity-70"
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-4 bg-gray-100 bg-opacity-70"
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

              <Button className="w-full p-6 bg-custom-blue2 hover:bg-slate-800 text-white font-semibold text-lg">
                SIGN UP
              </Button>

              <div className="text-center text-gray-600">
                Already have an account?
                <Link
                  to="/login"
                  className="ml-1 text-gray-800 hover:underline"
                >
                  Login
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
    </div>
  );
}

export default SignupPage;
