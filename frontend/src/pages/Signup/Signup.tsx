// import React from "react";
// import { useState, FormEvent, ChangeEvent } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Eye, EyeOff } from "lucide-react";  
// import { Input } from "../../components/ui/input";  
// import { Button } from "../../components/ui/button";
// import axios, { AxiosError } from "axios";


// // Define interface for API response
// interface SignupResponse {
//   success: boolean;
//   message?: string;
// }

// // Define interface for API error response
// interface ErrorResponse {
//   message: string;
// }

// function SignupPage():  React.ReactElement  {
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [firstName, setFirstName] = useState<string>("");
//   const [lastName, setLastName] = useState<string>("");
//   const [phone, setPhone] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [error, setError] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const navigate = useNavigate();

//   const togglePasswordVisibility = (): void => {
//     setShowPassword((prev) => !prev);
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
//     e.preventDefault();
//     setError("");
    
//     // Basic validation
//     if (!firstName || !lastName || !phone || !email || !password) {
//       setError("All fields are required");
//       return;
//     }
    
//     if (password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return;
//     }
    
//     if (!/^\d+$/.test(phone)) {
//       setError("Phone number should contain only digits");
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
//       const response = await axios.post<SignupResponse>(
//         `${apiUrl}/api/auth/register`,
//         {
//           name: firstName,
//           lName: lastName,
//           phone: Number(phone),
//           email,
//           password
//         },
//         {
//           withCredentials: true // To allow cookies to be set
//         }
//       );
      
//       if (response.data.success) {
//         // Redirect to login on successful signup
//         navigate("/login");
//       } else {
//         setError(response.data.message || "Signup failed. Please try again.");
//       }
//     } catch (err) {
//       const error = err as AxiosError<ErrorResponse>;
//       if (error.response) {
//         setError(error.response.data.message || "An error occurred during signup");
//       } else if (error.request) {
//         setError("Unable to connect to the server. Please check your internet connection.");
//       } else {
//         setError("An error occurred. Please try again later.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full relative overflow-hidden">
//       <div className="absolute inset-0 bg-[url('/images/background.png')] bg-cover bg-center">
//         <div className="absolute inset-0"></div>
//       </div>

//       {/* Content container */}
//       <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-center p-4 md:p-8 lg:p-12">
//         <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl">
//           {/* Left side - Temple Image */}
//           <div className="w-full md:w-1/2 h-80 md:h-auto relative">
//             <img
//               src="/images/signup.png"
//               alt="Japanese temple with cherry blossoms"
//               className="w-full h-80 md:h-auto object-cover"
//             />
//           </div>

//           {/* Right side - Form */} 
//           <div
//             className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center 
//                        bg-gradient-to-b from-pink-200/80 to-lime-600/20 
//                        backdrop-blur-sm"
//           >
//             <div className="flex justify-center mb-8">
//               <img
//                 src="/images/logoBlue.png"
//                 alt="Company Logo"
//                 className="h-16 w-auto"
//               />
//             </div>

//             <h1 className="text-3xl text-custom-blue2 mb-6 ubuntu">
//               Create Your Account
//             </h1>
            
//             {error && (
//               <div className="text-red-500 text-center mb-4">{error}</div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Input
//                     type="text"
//                     placeholder="First Name"
//                     className="w-full p-4 bg-gray-100 bg-opacity-70"
//                     value={firstName}
//                     onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Input
//                     type="text"
//                     placeholder="Last Name"
//                     className="w-full p-4 bg-gray-100 bg-opacity-70"
//                     value={lastName}
//                     onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
//                     required
//                   />
//                 </div>
//               </div>

//               <Input
//                 type="tel"
//                 placeholder="Phone Number"
//                 className="w-full p-4 bg-gray-100 bg-opacity-70"
//                 value={phone}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
//                 required
//               />

//               <Input
//                 type="email"
//                 placeholder="Email"
//                 className="w-full p-4 bg-gray-100 bg-opacity-70"
//                 value={email}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
//                 required
//               />

//               <div className="relative">
//                 <Input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Password"
//                   className="w-full p-4 bg-gray-100 bg-opacity-70"
//                   value={password}
//                   onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
//                   required
//                   minLength={6}
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>

//               <Button 
//                 type="submit"
//                 className="w-full p-6 bg-custom-blue2 hover:bg-slate-800 text-white font-semibold text-lg"
//                 disabled={loading}
//               >
//                 {loading ? "SIGNING UP..." : "SIGN UP"}
//               </Button>

//               <div className="text-center text-gray-600">
//                 Already have an account?
//                 <Link
//                   to="/login"
//                   className="ml-1 text-gray-800 hover:underline"
//                 >
//                   Login
//                 </Link>
//               </div>

//               <div className="text-center italic text-gray-700 mt-4">
//                 Enjoy exploring new knowledge and
//                 <br />
//                 making the most of your learning journey!
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignupPage;










import React from "react";
import { useState, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";  
import { Input } from "../../components/ui/input";  
import { Button } from "../../components/ui/button";
import axios, { AxiosError } from "axios";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber } from 'react-phone-number-input';

// Import flag emoji utilities
import flags from 'react-phone-number-input/flags';

// Define interface for API response
interface SignupResponse {
  success: boolean;
  message?: string;
}

// Define interface for API error response
interface ErrorResponse {
  message: string;
}

function SignupPage(): React.ReactElement {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = (): void => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!firstName || !lastName || !phoneNumber || !email || !password) {
      setError("All fields are required");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    // Validate phone number
    if (!isValidPhoneNumber(phoneNumber)) {
      setError("Please enter a valid phone number");
      return;
    }
    
    setLoading(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.post<SignupResponse>(
        `${apiUrl}/api/auth/register`,
        {
          name: firstName,
          lName: lastName,
          phone: phoneNumber, // Send the full international phone number
          email,
          password
        },
        {
          withCredentials: true // To allow cookies to be set
        }
      );
      
      if (response.data.success) {
        // Redirect to login on successful signup
        navigate("/login");
      } else {
        setError(response.data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      if (error.response) {
        setError(error.response.data.message || "An error occurred during signup");
      } else if (error.request) {
        setError("Unable to connect to the server. Please check your internet connection.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/background.png')] bg-cover bg-center">
        <div className="absolute inset-0"></div>
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
                src="/logo1new.png"
                alt="Company Logo"
                className="h-16 w-auto"
              />
            </div>

            <h1 className="text-3xl text-custom-blue2 mb-6 ubuntu">
              Create Your Account
            </h1>
            
            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    placeholder="First Name"
                    className="w-full p-4 bg-gray-100 bg-opacity-70"
                    value={firstName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    className="w-full p-4 bg-gray-100 bg-opacity-70"
                    value={lastName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Phone Input with Country Selection */}
              <div className="phone-input-container">
                <PhoneInput
                  international
                  defaultCountry="LK" // Sri Lanka as default
                  flags={flags}
                  value={phoneNumber}
                  onChange={setPhoneNumber as (value: string | undefined) => void}
                  placeholder="Phone Number"
                  className="w-full bg-opacity-70 rounded-md"
                  style={{
                    '--PhoneInputCountryFlag-height': '20px',
                    '--PhoneInputCountryFlag-borderWidth': '0',
                    '--PhoneInputCountrySelectArrow-opacity': '0.5',
                  } as React.CSSProperties}
                  inputComponent={Input}
                  required
                />
              </div>

              <Input
                type="email"
                placeholder="Email"
                className="w-full p-4 bg-gray-100 bg-opacity-70"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-4 bg-gray-100 bg-opacity-70"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                  minLength={6}
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

              <Button 
                type="submit"
                className="w-full p-6 bg-custom-blue2 hover:bg-slate-800 text-white font-semibold text-lg"
                disabled={loading}
              >
                {loading ? "SIGNING UP..." : "SIGN UP"}
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
            </form>
          </div>
        </div>
      </div>

      {/* Add custom CSS for the phone input */}
      <style>{`
        .phone-input-container :global(.PhoneInput) {
          display: flex;
          align-items: center;
          background-color: rgba(243, 244, 246, 0.7);
          border-radius: 0.375rem;
        }
        
        .phone-input-container :global(.PhoneInputCountry) {
          margin-right: 0.75rem;
          padding-left: 0.75rem;
        }
        
        .phone-input-container :global(.PhoneInputInput) {
          flex: 1;
          border: none;
          padding: 1rem;
          background-color: transparent;
        }
        
        .phone-input-container :global(.PhoneInputInput:focus) {
          outline: none;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}

export default SignupPage;