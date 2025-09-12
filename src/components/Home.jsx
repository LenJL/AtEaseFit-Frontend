import React, { useState, useEffect } from "react";
import Navigation from "./NavigationBar";
import { motion } from "framer-motion";
import PopUp from "./PopUp";
import { Link, useNavigate } from "react-router-dom";
import About from "./About";

export default function Tracker() {
  const [showModal, setShowModal] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const navigate = useNavigate();

  // List of quotes for rotation
  const quotes = [
    "Commit to be fit, dare to be great!",
    "Consistency is the key to success.",
    "Small daily improvements lead to stunning results.",
    "Progress, not perfection.",
    "The only bad workout is the one you didn’t do.",
    "Success is the sum of small efforts, repeated daily.",
    "Stay consistent, stay dedicated, stay unstoppable.",
    "Your only limit is you—push past it daily.",
    "Great things take time. Keep going!",
    "It’s not about being the best. It’s about being better than yesterday.",
    "Motivation gets you started, but habit keeps you going.",
    "Sweat, sacrifice, succeed—repeat.",
    "Discipline is choosing between what you want now and what you want most.",
    "Make time for fitness, or make time for excuses.",
    "The secret of success is constancy to purpose.",
    "A little progress each day adds up to big results.",
    "You don’t have to be extreme, just consistent.",
    "Fitness is not a destination, it's a way of life.",
    "Your body achieves what your mind believes.",
    "Winners do daily what others do occasionally.",
    "The pain of discipline is better than the pain of regret.",
    "Slow progress is still progress—never stop.",
    "Stay patient and trust the journey.",
    "One step at a time, one rep at a time.",
    "No shortcuts, just hard work and consistency.",
    "Fall in love with the process, and results will follow.",
    "The magic happens when you don’t give up.",
    "Effort compounds over time—stay with it.",
    "Do something today that your future self will thank you for.",
    "Every workout counts, no matter how small.",
    "The strongest factor for success is self-discipline.",
    "Results happen over time, not overnight. Work hard, stay consistent.",
    "Commit to consistency, and the results will come.",
    "Fitness is 10% talent and 90% consistency.",
    "Push yourself because no one else will do it for you.",
    "Hard work beats talent when talent doesn’t work hard.",
    "Stop wishing, start doing.",
    "The difference between failure and success is persistence.",
    "Train like a beast, look like a beauty.",
    "Your future is created by what you do today, not tomorrow.",
    "Doubt kills more dreams than failure ever will.",
    "A one-hour workout is 4% of your day. No excuses!",
    "Make yourself proud every single day.",
    "Get fit in the gym, lose weight in the kitchen, stay consistent in both.",
    "You didn’t come this far to only come this far.",
    "Strive for progress, not perfection.",
    "Repetition is the mother of mastery.",
    "Show up, work hard, and never give up.",
  ];

  // Scroll effect for background opacity
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newOpacity = Math.max(0.6, 1 - scrollY / 800);
      setBgOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Quote rotation effect every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      setShowModal(true); // Show pop-up
    } else {
      navigate("/Login"); // Redirect to login if not authenticated
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black/50 overflow-y-auto">
      {/* Background Video */}
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
        <video autoPlay loop muted className="w-full h-full object-cover">
          <source src="/BGAtease.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 -z-10"></div>

      {/* Navbar Component */}
      <Navigation />

      {/* Hero Section */}
      <div className="flex items-center justify-center h-screen">
        <div className="relative px-8 py-12  text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold sm:text-7xl text-white"
          >
            AtEaseFit
          </motion.h1>

          <motion.p
            key={quoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-4 text-lg sm:text-xl text-white font-weight: 700; italic"
          >
            "{quotes[quoteIndex]}"
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            onClick={handleGetStarted}
            className="mt-6 px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition transform hover:scale-105"
          >
            Get Started
          </motion.button>
        </div>
      </div>

      {/* What We Offer Section */}
      <About />

      {/* Show PopUp when state is true */}
      {showModal && <PopUp onClose={() => setShowModal(false)} />}
    </div>
  );
}
