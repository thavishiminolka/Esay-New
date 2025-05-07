// import React, { useState } from "react";
// import axios from "axios";
// import { FormProps } from "../type";

// const Form: React.FC<FormProps> = ({ type }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const endpoint =
//         type === "login" ? "/api/admin/login" : "/api/admin/signup";
//       await axios.post(`http://localhost:5000${endpoint}`, { email, password });

//       if (type === "login") {
//         window.location.href = "/admindashboard";
//       } else {
//         alert("Signup successful! Please login.");
//         window.location.href = "/login";
//       }
//     } catch (err: any) {
//       console.error(`${type} error:`, err.response?.data);
//       setError(err.response?.data?.message || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">
//           {type === "login" ? "Admin Login" : "Admin Signup"}
//         </h2>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2" htmlFor="email">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block text-gray-700 mb-2" htmlFor="password">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
//           >
//             {loading ? "Processing..." : type === "login" ? "Login" : "Signup"}
//           </button>
//         </form>
//         <p className="mt-4 text-center">
//           {type === "login" ? (
//             <>
//               Don't have an account?{" "}
//               <a href="/signup" className="text-blue-500">
//                 Signup
//               </a>
//             </>
//           ) : (
//             <>
//               Already have an account?{" "}
//               <a href="/login" className="text-blue-500">
//                 Login
//               </a>
//             </>
//           )}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Form;

"use client";

import React, { useState } from "react";
import axios from "axios";
import { FormProps } from "../type";

const Form: React.FC<FormProps> = ({ type }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretId, setSecretId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (type === "signup") {
        const expectedSecretId = "EPS2025_SECRET_789";
        if (!secretId || secretId !== expectedSecretId) {
          setError("Invalid or missing Secret ID");
          setLoading(false);
          return;
        }
      }

      const endpoint =
        type === "login" ? "/api/admin/login" : "/api/admin/signup";
      const payload =
        type === "login" ? { email, password } : { email, password, secretId };
      await axios.post(`http://localhost:5000${endpoint}`, payload);

      if (type === "login") {
        window.location.href = "/admindashboard";
      } else {
        alert("Signup successful! Please login.");
        window.location.href = "/login";
      }
    } catch (err: any) {
      console.error(`${type} error:`, err.response?.data);
      setError(err.response?.data?.message || "An error occurred");
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
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
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
