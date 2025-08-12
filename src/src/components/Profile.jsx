import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "./NavigationBar";
import PopUp from "./PopUp";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error("❌ Profile Fetch Error:", error.message);
        navigate("/Login", { replace: true });
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log("selected file:", file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("profilePic", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/auth/uploadProfilePic`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setUserProfile((prev) => ({
        ...prev,
        profilePic: data.profilePic,
      }));
      setSelectedFile(null);
    } catch (error) {
      console.error("❌ Upload Error:", error.message);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  if (!userProfile) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover">
        <source src="/AtEaseFit/BGAtease.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-black/80"></div>

      <Navigation />

      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-6 pt-30 py-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[90%] max-w-7xl p-10 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700"
        >
          <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-600">
            <img
              src={userProfile.profilePic ? `${API_BASE}${userProfile.profilePic}` : "/AtEaseFit/profile.jpg"}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-gray-500 shadow-lg"
            />

            <input type="file" accept="image/*" onChange={handleFileChange} className="text-white" />

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-500"
            >
              {uploading ? "Uploading..." : "Upload Profile Picture"}
            </button>

            <div>
              <h1 className="text-3xl font-bold text-white">Welcome, {userProfile.name}!</h1>
              <p className="text-gray-300 text-lg">{userProfile.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-gray-900 p-5 rounded-lg shadow-md">
              <p className="font-bold text-lg text-white mb-2">Workout Split</p>
              <p className="text-gray-300">
                {userProfile.workoutSplit || "Not Set"}
                <span className="text-blue-400 cursor-pointer ml-2">(edit)</span>
              </p>
            </div>

            <div className="bg-gray-900 p-5 rounded-lg shadow-md">
              <p className="font-bold text-lg text-white mb-2">BMR: {userProfile.bmr || "2200"} Kcal</p>
              <p className="text-gray-300">Maintenance: {userProfile.maintenance || "2500"} Kcal</p>
              <p className="text-gray-300">To Gain Weight: {userProfile.gainWeight || "2700"} Kcal</p>
              <p className="text-gray-300">To Lose Weight: {userProfile.loseWeight || "2000"} Kcal</p>
            </div>

            <div className="bg-gray-900 p-5 rounded-lg shadow-md">
              <p className="font-bold text-lg text-white mb-2">BMI: {userProfile.bmi || "21.2"}</p>
              <p className="text-gray-300">Category: {userProfile.category || "Normal Weight"}</p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/Login");
            }}
            className="w-full bg-red-500 text-white py-3 mt-8 rounded-lg hover:opacity-90 shadow-lg transition text-lg"
          >
            Logout
          </motion.button>
        </motion.div>
      </div>

      {showModal && <PopUp onClose={() => setShowModal(false)} />}
    </div>
  );
}
