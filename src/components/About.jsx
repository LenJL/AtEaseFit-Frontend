 import { motion } from "framer-motion";
 import React, { useState, useEffect } from "react";

 export default function About(){
    const [bgOpacity, setBgOpacity] = useState(1);

     useEffect(() => {
        const handleScroll = () => {
          const scrollY = window.scrollY;
          const newOpacity = Math.max(0.2, 1 - scrollY / 600);
          setBgOpacity(newOpacity);
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, []);
    return(
        <div className="relative min-h-screen overflow-x-hidden overflow-y-auto">
      {/* Background Video */}
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
        <video autoPlay loop muted className="w-full h-full object-cover">
          <source src="/AtEaseFit/BGAtease.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
        <div
        className="relative py-20 text-white text-center transition-all duration-300"
        style={{ background: `linear-gradient(to bottom, rgba(31, 41, 55, ${bgOpacity}), rgba(31,41,55,1))` }}
      >
        <h2 id="about" className="text-4xl font-bold">What We Offer</h2>
        <div className="mt-10 space-y-16">
          {[
            {
              title: "BMR",
              desc: "Basal Metabolic Rate helps you understand your daily calorie needs.",
              img: "/AtEaseFit/images/bmr.jpg",
            },
            {
              title: "BMI",
              desc: "Body Mass Index is a measure of body fat based on height and weight.",
              img: "/AtEaseFit/images/BMI.jpg",
            },
            {
              title: "Minimalist Workout Splits",
              desc: "A structured yet simple approach to effective workouts.",
              img: "/AtEaseFit/images/workout.jpg",
            },
            {
              title: "Diet Composition",
              desc: "Learn the perfect balance of macros for your fitness goals.",
              img: "/AtEaseFit/images/Dcomp.jpg",
            },
            {
              title: "Progress Tracker",
              desc: "Monitor your improvements and stay motivated.",
              img: "/AtEaseFit/images/tracker.jpg",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{
                opacity: 0,
                x: index % 2 === 0 ? -100 : 100,
                rotateY: 90,
              }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{
                opacity: 0,
                x: index % 2 === 0 ? -100 : 100,
                rotateY: 90,
              }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg flex ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              } items-center space-x-6`}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div className="text-left">
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-gray-300">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    )
 }
 