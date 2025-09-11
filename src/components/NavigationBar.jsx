"use client";
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import profileicon from "./profile.svg";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const guestNavigation = [
  { name: "Home", href: "/AtEaseFit/" },
  { name: "Workout", href: "/WorkoutSpiltNav" },
  { name: "About", href: "/About" },
];

const userNavigation = [
  { name: "Home", href: "/AtEaseFit/" },
  { name: "Workout", href: "/WorkoutSpiltNav" },
  { name: "Tracker", href: "/Tracker" },
  { name: "Diet Composition", href: "/DietComp" },
];

const NavLink = ({ name, href, className }) => (
  <Link to={href} className={`text-lg font-semibold ${className}`}>
    {name}
  </Link>
);

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserProfile(null);
    navigate("/AtEaseFit/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-black/50">
      <nav className="relative flex items-center justify-between px-8 py-3">
        <NavLink name="AtEaseFit" href="/AtEaseFit/" className="text-white text-xl font-bold" />
        <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2.5 text-white">
          <Bars3Icon className="size-6" />
        </button>

        <div className="hidden lg:flex gap-x-10">
          {(isLoggedIn ? userNavigation : guestNavigation).map((item) => (
            <NavLink key={item.name} {...item} className="text-white hover:text-gray-300" />
          ))}
        </div>

        <div className="hidden lg:flex items-center relative">
          {isLoggedIn ? (
            <div>
              <button onClick={() => setShowProfileDropdown(!showProfileDropdown)} className="focus:outline-none">
                {loading ? (
                  <div className="w-8 h-8 flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <img src={profileicon} alt="Profile" className="w-8 h-8 rounded-full cursor-pointer" />
                )}
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl overflow-hidden">
                  <div className="p-4 flex items-center gap-3 bg-gray-100">
                   <img src={userProfile?.profilePic || `${apiUrl}/uploads/default.jpg`}alt="Profile" className="w-12 h-12 rounded-full" />
                    <div>
                      <h4 className="font-semibold text-gray-800">{userProfile?.name || "User"}</h4>
                      <p className="text-sm text-gray-500">{userProfile?.email || "User"}</p>
                    </div>
                  </div>
                  <div className="py-2">
                    <Link to="/Profile" className="block px-4 py-3 text-blue-600 font-semibold hover:bg-gray-100">
                      View Profile
                    </Link>
                  </div>
                  <div className="border-t">
                    <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-red-600 font-semibold hover:bg-gray-100">
                      🚪 Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <NavLink name="Log in →" href="/Login" className="text-white text-lg" />
          )}
        </div>
      </nav>

  <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
  {/* Transparent & Blurred Background */}
  <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md" />

  <div className="fixed inset-y-0 right-0 z-50 w-64 bg-white/90 shadow-lg rounded-l-2xl">
    {/* Menu Header */}
    <div className="flex justify-between items-center px-5 py-4 border-b">
      <span className="text-lg font-bold text-gray-800">Menu</span>
      <button onClick={() => setMobileMenuOpen(false)} className="p-2">
        <XMarkIcon className="size-6 text-gray-800" />
      </button>
    </div>

    {/* Navigation Links */}
    <div className="p-5">
      {(isLoggedIn ? userNavigation : guestNavigation).map((item) => (
        <NavLink
          key={item.name}
          {...item}
          className="block py-2 text-gray-800 hover:text-gray-600"
        />
      ))}
    </div>

    {/* Logout Button (Only when logged in) */}
    {isLoggedIn && (
      <div className="absolute bottom-4 left-0 w-full px-5">
        <button
          onClick={handleLogout}
          className="w-full py-2 text-center text-red-600 font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          Logout 🚪
        </button>
      </div>
    )}
  </div>
</Dialog>
<Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
  {/* Transparent & Blurred Background */}
  <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md" />

  <div className="fixed inset-y-0 right-0 z-50 w-64 bg-transparent backdrop-blur-md shadow-lg rounded-l-2xl">
    {/* Menu Header */}
    <div className="flex justify-between items-center px-5 py-4 border-b border-gray-300/30">
      <span className="text-lg font-bold text-white">Menu</span>
      <button onClick={() => setMobileMenuOpen(false)} className="p-2">
        <XMarkIcon className="size-6 text-white" />
      </button>
    </div>

    {/* Navigation Links */}
    <div className="p-5">
      {(isLoggedIn ? userNavigation : guestNavigation).map((item) => (
        <NavLink
          key={item.name}
          {...item}
          className="block py-2 text-white hover:text-gray-300"
        />
      ))}
    </div>

    {/* Logout Button (Only when logged in) */}
    {isLoggedIn && (
      <div className="absolute bottom-4 left-0 w-full px-5">
        <button
          onClick={handleLogout}
          className="w-full py-2 text-center text-red-400 font-semibold bg-white/10 hover:bg-white/20 rounded-lg"
        >
          Logout 🚪
        </button>
      </div>
    )}
  </div>
</Dialog>


    </header>
  );
}