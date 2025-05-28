import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function Signin() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    retypePassword: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.retypePassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Welcome to AtEaseFit");

        // ✅ Store token & user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Redirect based on response
        if (data.redirectToUpload) {
          navigate("/upload-profile"); // Redirect to profile pic upload
        } else {
          navigate("/AtEaseFit");
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  const handleGoogleSignin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        const userData = {
          name: res.data.name,
          email: res.data.email,
          googleId: res.data.sub,
        };

        const response = await axios.post("http://localhost:5000/api/auth/google", userData);
        const data = response.data;

        if (data) {
          alert("Login successful!");
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // ✅ Redirect based on response
          if (data.redirectToUpload) {
            navigate("/upload-profile");
          } else {
            navigate("/AtEaseFit");
          }
        }
      } catch (error) {
        console.error("Google login error:", error);
        alert("Google login failed");
      }
    },
  });

  return (
    <div className="flex h-screen w-full relative">
      {/* Background Video */}
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
        <h1 className="text-white text-5xl font-bold">
          Join <span className="text-indigo-400">AtEaseFit</span>
        </h1>
        <p className="text-white text-lg mt-4">Start your fitness journey today. Sign up now.</p>
      </div>

      {/* Sign-up Form */}
      <div className="flex justify-center items-center w-1/2 relative z-10">
        <div className="bg-white w-[500px] rounded-xl shadow-lg p-10">
          <h2 className="text-center text-2xl font-bold mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-md font-medium">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-md font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-md font-medium">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-md font-medium">Retype Password</label>
              <input
                type="password"
                name="retypePassword"
                placeholder="Retype your password"
                value={formData.retypePassword}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700"
            >
              Sign Up
            </button>
          </form>

          {/* Google Sign-in Button */}
          <button
            onClick={handleGoogleSignin}
            className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg mt-4 hover:bg-red-600"
          >
            Sign in with Google
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <span className="text-indigo-500 cursor-pointer" onClick={() => navigate("/Login")}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
