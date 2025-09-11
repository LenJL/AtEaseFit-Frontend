      import { useEffect, useState } from "react";
      import { useNavigate } from "react-router-dom";
      import { motion } from "framer-motion";
      import { FaPen } from "react-icons/fa";
      import Navigation from "./NavigationBar";
      import PopUp from "./PopUp";
      import Tracker from "./Tracker";
      const apiUrl = import.meta.env.VITE_BACKEND_URL;

      export default function Profile() {
        const [userProfile, setUserProfile] = useState(null);
        const [showModal, setShowModal] = useState(false);
        const [selectedFile, setSelectedFile] = useState(null);
        const [showPopUp, setShowPopUp] = useState(false);
        const [initialTab, setInitialTab] = useState(null);
        const [uploading, setUploading] = useState(false);
        const [refresh, setRefresh] = useState(false); // Add refresh trigger
        const navigate = useNavigate(); 

        

        useEffect(() => {
          const storedToken = localStorage.getItem("token");
        
          if (!storedToken) {
            navigate("/login", { replace: true });
            return;
          }
        
          const fetchProfile = async () => {
            try {
              const response = await fetch(`${apiUrl}/api/auth/profile`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${storedToken}`,
                },
              });
        
              if (!response.ok) throw new Error("Failed to fetch profile data");
        
              const data = await response.json();
              setUserProfile(data);
            } catch (error) {
              console.error("❌ Profile Fetch Error:", error.message);
              navigate("/Login", { replace: true });
            }
          };
        
          // Initial fetch
          fetchProfile();
        
          // Re-fetch if update flag is set
          const shouldUpdate = localStorage.getItem("profileUpdated");
          if (shouldUpdate === "true") {
            fetchProfile();
            localStorage.removeItem("profileUpdated");
          }
        }, [navigate]);
        
        
        const handleFileChange = (event) => {
          const file = event.target.files[0];
          setSelectedFile(file);
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
            const response = await fetch(
              `${apiUrl}/api/auth/uploadProfilePic`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: formData,
              }
            );

            if (!response.ok) {
              throw new Error("Failed to upload the image");
            }

            const data = await response.json();
            console.log(
              "✅ Upload successful, new profile pic URL:",
              data.profilePic
            );

            setUserProfile((prev) => ({
              ...prev,
              profilePic: `${apiUrl}${
                data.profilePic
              }?t=${new Date().getTime()}`,
            }));

            setSelectedFile(null);
          } catch (error) {
            console.error("❌ Upload Error:", error.message);
            alert("Failed to upload Image.");
          } finally {
            setUploading(false);
          }
        };

        if (!userProfile) {
          return (
            <div className="flex items-center justify-center h-screen text-white">
              Loading...
            </div>
          );
        }

        return (
          <div className="relative min-h-screen flex flex-col">
            <video
              autoPlay
              loop
              muted
              className="absolute inset-0 w-full h-full object-cover"
            >
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
                <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-600 relative">
                  <div className="relative">
                    <img
                      src={
                        userProfile?.profilePic ||
                        `${apiUrl}/uploads/default.jpg`
                      }
                      alt="Profile"
                      className="w-28 h-28 rounded-full border-4 shadow-lg object-cover"
                      key={userProfile.profilePic}
                    />
                    <label className="absolute bottom-1 right-1 bg-blue-500 p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-600">
                      <FaPen className="text-white text-sm" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {selectedFile && (
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-500"
                    >
                      {uploading ? "Uploading..." : "Upload Profile Picture"}
                    </button>
                  )}

                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      Welcome, {userProfile.name}!
                    </h1>
                    <p className="text-gray-300 text-lg">{userProfile.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-gray-900 p-5 rounded-lg shadow-md">
                  <p className="font-bold text-lg text-white mb-2">Workout Split</p>
                  {userProfile.workoutSplit && (
                    <button
                    className="mt-4 w-full py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-all duration-300"
                    onClick={() => {
                      if (
                        userProfile.workoutSplit?.gender &&
                        userProfile.workoutSplit?.days
                      ) {
                        navigate(
                          `/workout-split/${userProfile.workoutSplit.gender}-${userProfile.workoutSplit.days}`
                        );
                      } else {
                        navigate("/WorkoutSpiltNav");
                      }
                    }}
                  >
                    {userProfile.workoutSplit?.days
                      ? `${userProfile.workoutSplit.days}-Day Workout Plan`
                      : "Choose Workout Plan"}
                  </button>
                  )}
                  <button
                    className="mt-4 w-full  py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-all duration-300"
                   onClick={() =>
                     navigate("/WorkoutSpiltNav")
                   }
                 >
                  Edit
                 </button>
                </div>


                  <div className="bg-gray-900 p-5 rounded-lg shadow-md">
                    <p className="font-bold text-lg text-white mb-2">
                      BMR: {userProfile.bmr || "Not Set"} Kcal
                    </p>
                    <p className="text-gray-300">
                      Maintenance: {userProfile.maintenance || "Not Set"} Kcal
                    </p>
                    <p className="text-gray-300">
                      To Gain Weight: {userProfile.gainWeight || "Not Set"} Kcal
                    </p>
                    <p className="text-gray-300">
                      To Lose Weight: {userProfile.loseWeight || "Not Set"} Kcal
                    </p>
                    <button
                      onClick={() => {
                        setInitialTab("bmr"); // Set initial tab to BMR
                        setShowPopUp(true);
                      }} // Show the PopUp
                      className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700  transition"
                    >
                      Check
                    </button>
                  </div>

                  <div className="bg-gray-900 p-5 rounded-lg shadow-md">
                    <p className="font-bold text-lg text-white mb-2">
                      BMI: {userProfile.bmi || "Not Set"}
                    </p>
                    <p className="text-gray-300 pb-12">
                      Category: {userProfile.category || "Not Set"}
                    </p>
                    <button
                      onClick={() => {
                        setInitialTab("bmi"); // Set initial tab to BMR
                        setShowPopUp(true);
                      }} // Show the PopUp
                      className="mt-3 bg-purple-600 text-white px-4 py-2  rounded-lg hover:bg-purple-700  transition"
                    >
                      Check
                    </button>
                  </div>
                      <div className="bg-gray-900 p-5 rounded-lg shadow-md">
                      <p className="font-bold text-lg text-white mb-2">
                        Latest Tracker Entry
                      </p>
                      {userProfile.workoutEntry && userProfile.workoutEntry.length > 0 ? (
                        <div>
                          <p className="text-gray-300">
                            <strong>Weight:</strong> {userProfile.workoutEntry[0].weight || "No Entries"} kg
                          </p>
                          <p className="text-gray-300">
                            <strong>Workout:</strong> {userProfile.workoutEntry[0].workout || "No Entries"}
                          </p>
                          <p className="text-gray-300">
                            <strong>Diet Maintained:</strong> {userProfile.workoutEntry[0].dietMaintained ? "✔ Yes" : "❌ No"}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-400">No tracker entries yet.</p>
                      )}
                      <button
                        onClick={() => navigate("/tracker")}
                        className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                      >
                        Tracks
                      </button>
                    </div>

                </div>

                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/Login");
                  }}
                  className="w-full bg-red-500 text-white py-3 mt-8 rounded-lg hover:opacity-90 shadow-lg transition text-lg"
                >
                  Logout
                </button>
              </motion.div>
              {/* Show PopUp and pass initialTab */}
              {showPopUp && (
                <PopUp onClose={() => setShowPopUp(false)} initialTab={initialTab} />
              )}
            </div>
          </div>
        );
      }