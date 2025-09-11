import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful!");
        localStorage.setItem("token", data.token);
        navigate("/AtEaseFit/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  // Google Login
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        const userData = {
          name: res.data.name,
          email: res.data.email,
          googleId: res.data.sub,
        };

        const response = await axios.post(
          `${apiUrl}/api/auth/google`,
          userData
        );

        if (response.data) {
          alert("Login successful!");
          localStorage.setItem("token", response.data.token);
          navigate("/AtEaseFit/");
        }
      } catch (error) {
        console.error("Google login error:", error);
        alert("Google login failed");
      }
    },
  });

  return (
    <div className="flex h-screen w-full relative">
      {/* Background Image */}
      <div className="absolute inset-0">
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
        <video autoPlay loop muted className="w-full h-full object-cover">
          <source src="/AtEaseFit/BGAtease.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      {/* Left Section */}
      <div className="flex flex-col justify-center pl-16 w-1/2 relative z-10">
        <h1 className="text-white text-5xl font-bold">Welcome to <span className="text-indigo-400">AtEaseFit</span></h1>
        <p className="text-white text-lg mt-4">Your fitness journey starts here. Log in to continue.</p>
      </div>
      
      {/* Right Section - Login Form */}
      <div className="flex justify-center items-center w-1/2 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-10 w-96">
          <h2 className="text-center text-2xl font-bold mb-6">Log in</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-md font-medium">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-md font-medium">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
              />
            </div>

            {/* Login Button */}
            <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700">Log in</button>
          </form>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg mt-4 hover:bg-red-600"
          >
            Log in with Google
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account? <span className="text-indigo-500 cursor-pointer" onClick={() => navigate("/Signin")}>Sign up here</span>
          </p>
        </div>
      </div>
    </div>
  );
}