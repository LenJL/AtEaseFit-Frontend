import { motion } from "framer-motion";
import { useState } from "react";

export default function BMICalculator({ onBack, onBMIUpdate }) {
  const [bmiResult, setBmiResult] = useState(null);
  const [category, setCategory] = useState("");

  const calculateBMI = async () => {
    const weight = parseFloat(document.getElementById("bmi-weight").value);
    const height = parseFloat(document.getElementById("bmi-height").value) / 100;

    if (!weight || !height || weight <= 20 || weight > 300 || height <= 0.5 || height > 2.5) {
      alert("Please enter realistic values: \n- Weight: 20–300 kg \n- Height: 50–250 cm");
      return;
    }

    const bmi = (weight / (height * height)).toFixed(2);
    let bmiCategory = "";
    if (bmi < 18.5) bmiCategory = "Underweight";
    else if (bmi >= 18.5 && bmi < 24.9) bmiCategory = "Normal weight";
    else if (bmi >= 25 && bmi < 29.9) bmiCategory = "Overweight";
    else bmiCategory = "Obese";

    setBmiResult(bmi);
    setCategory(bmiCategory);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/auth/updateBMI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bmi,
          category: bmiCategory,
        }),
      });

      if (!response.ok) throw new Error("Failed to update BMI in profile");

      console.log("✅ BMI updated successfully");

      if (onBMIUpdate) onBMIUpdate();
    } catch (error) {
      console.error("❌ Error updating BMI:", error.message);
    }
  };

  return (
    <div className="relative flex w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-2xl w-[400px] shadow-lg flex flex-col"
      >
        <h2 className="text-xl font-bold text-gray-800 text-center">BMI Calculator</h2>
        <p className="text-gray-600 text-sm text-center">Enter your details below.</p>
        <div className="mt-4 space-y-3">
          <input type="number" id="bmi-weight" placeholder="Weight (kg)" className="w-full px-4 py-2 border rounded-md text-sm" />
          <input type="number" id="bmi-height" placeholder="Height (cm)" className="w-full px-4 py-2 border rounded-md text-sm" />
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            onClick={calculateBMI}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-400 transition text-sm"
          >
            Calculate BMI
          </motion.button>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition text-sm"
        >
          Back
        </motion.button>
      </motion.div>

      <div className="w-[300px] p-6 ml-4 bg-gray-100 rounded-2xl shadow-lg flex flex-col items-center">
        <h2 className="text-xl font-bold text-gray-800 text-center">Your BMI Results</h2>
        {bmiResult ? (
          <div className="text-center mt-4">
            <p className="text-2xl font-semibold text-gray-700">BMI: {bmiResult}</p>
            <p className="text-xl mt-2 text-gray-800">Category: {category}</p>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-4">Your results will appear here</p>
        )}
      </div>
    </div>
  );
}
