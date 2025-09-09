
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "./NavigationBar";
import PopUp from "./PopUp";
import "../styles/tailwind.css";

export default function Tracker() {
  const [showModal, setShowModal] = useState(false);
  const [entries, setEntries] = useState([]);
  const [weight, setWeight] = useState("");
  const [workout, setWorkout] = useState("");
  const [dietMaintained, setDietMaintained] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showAllEntries, setShowAllEntries] = useState(false);
  


  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user profile");

        const data = await res.json();

        const formattedEntries = data.workoutEntry.map((entry) => ({
          ...entry,
          date: new Date(entry.date || entry.createdAt).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }
          ),
          dietMaintained:
            entry.dietMaintained === true || entry.dietMaintained === "true",
        }));

        setUserProfile(data);
        setEntries(formattedEntries);
      } catch (err) {
        console.error("❌ Error loading profile:", err.message);
      }
    };

    fetchUserProfile();
  }, []);

  const handleAddEntry = async () => {
    if (!weight || !workout || dietMaintained === null) {
      alert("Please fill in all fields.");
      return;
    }

    if (weight < 30 || weight > 200) {
      alert("Please enter a weight between 30 kg and 200 kg.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/auth/workoutEntry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ weight, workout, dietMaintained }),
      });

      if (!response.ok) throw new Error("Failed to save entry");

      const today = new Date();
      const formattedDate = today.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const newEntry = {
        date: formattedDate,
        weight,
        workout,
        dietMaintained,
      };

      setEntries((prev) => [newEntry, ...prev]);
      setWeight("");
      setWorkout("");
      setDietMaintained(null);
      setShowAllEntries(false); // Show only the new entry
      localStorage.setItem("profileUpdated", "true");
    } catch (error) {
      console.error("❌ Tracker Submit Error:", error.message);
      alert("Failed to add tracker entry.");
    }
  };



  const displayedEntries = showAllEntries ? entries : entries.slice(0, 1);

  const handleClearEntries = async () => {
    const confirmClear = window.confirm("Are you sure you want to clear all tracker entries?");
    if (!confirmClear) return;
  
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/auth/clearWorkoutEntries", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) throw new Error("Failed to clear entries");
  
      setEntries([]); // Clear entries from frontend state
      alert("All entries cleared successfully!");
    } catch (err) {
      console.error("❌ Error clearing entries:", err.message);
      alert("Failed to clear entries.");
    }
  };
  
  

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover">
        <source src="/AtEaseFit/BGAtease.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-gray-900"></div>

      <Navigation />

      <div className="relative z-10 pt-30 flex flex-col items-center justify-center min-h-screen px-4 w-[90%] max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            Workout & Diet Tracker
          </h2>

          <input
            type="number"
            placeholder="Enter weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg mb-3 focus:ring-2 focus:ring-gray-400 transition"
          />

          <select
            value={workout}
            onChange={(e) => setWorkout(e.target.value)}
            className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg mb-3 focus:ring-2 focus:ring-gray-400 transition"
          >
            <option value="">Select Workout</option>
            <option value="Push">Push (Chest,Triceps & Shoulders)</option>
            <option value="Pull">Pull (Back & Biceps)</option>
            <option value="Legs">Legs & Abs</option>
            <option value="Arms">Arms (Biceps & Triceps)</option>
            <option value="Quads & Abs">Full Body & Core</option>
            <option value="Glutes & Hamstrings">Hamstrings and Glutes</option>
            <option value="Upper Body + Core">Upper Body + Core</option>
            <option value="Cardio & Abs">Cardio & Abs</option>
            <option value="Glutes & Calves">Glutes & Calves</option>
          </select>

          <div className="flex justify-between items-center mt-3">
            <span className="text-white">Maintained Diet?</span>
            <div className="flex gap-4">
              <button
                className={`px-4 py-2 rounded ${
                  dietMaintained === true
                    ? "bg-green-500 text-white"
                    : "bg-gray-700"
                }`}
                onClick={() => setDietMaintained(true)}
              >
                ✔
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  dietMaintained === false
                    ? "bg-red-500 text-white"
                    : "bg-gray-700"
                }`}
                onClick={() => setDietMaintained(false)}
              >
                ❌
              </button>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            onClick={handleAddEntry}
            className="w-full bg-gradient-to-r from-[#4c1d95] to-[#6d28d9] text-white py-2 mt-4 rounded-lg hover:opacity-90 shadow-lg transition"
          >
            Add Entry
          </motion.button>

          <div className="mt-6 w-full">
            <h3 className="text-lg font-semibold text-white mb-2">Tracker Entries</h3>

            {entries.length > 1 && (
  <div className="flex justify-between items-center mb-4">
    <button
      onClick={() => setShowAllEntries(!showAllEntries)}
      className="text-sm text-indigo-300 underline"
    >
      {showAllEntries ? "Hide Previous Entries" : "Show Previous Entries"}
    </button>

    <button
      onClick={handleClearEntries}
      className="text-sm text-red-400 underline hover:text-red-600 transition"
    >
      Clear Entries
    </button>
  </div>
)}


            {entries.length === 0 ? (
              <p className="text-gray-400 text-center">No entries yet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayedEntries.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 min-w-[150px] min-h-[150px] border border-gray-600 rounded-lg shadow-sm bg-gray-900 text-white flex flex-col justify-center items-center"
                  >
                    <p className="text-sm">
                      <strong>Date:</strong> {entry.date}
                    </p>
                    <p className="text-sm">
                      <strong>Weight:</strong> {entry.weight} kg
                    </p>
                    <p className="text-sm">
                      <strong>Workout:</strong> {entry.workout}
                    </p>
                    <p className="text-sm">
                      <strong>Diet:</strong>{" "}
                      {entry.dietMaintained ? "✔ Maintained" : "❌ Not Maintained"}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {showModal && <PopUp onClose={() => setShowModal(false)} />}
    </div>
  );
}
