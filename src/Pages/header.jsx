import { useState, useEffect } from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../context/authContext";

const Header = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDropdown && !e.target.closest(".dropdown-container")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showDropdown]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-white/30 shadow-md"
          : "bg-white/60 backdrop-blur-md shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Title */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setCurrentPage("home")}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg flex items-center justify-center">
                <img className="w-6 h-6 text-white" src={"/logo.png"} />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <div>
              <span className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-500">
                Blogify
              </span>
              <div className="text-xs text-gray-500 font-medium">
                Where ideas come alive
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4 dropdown-container relative">
            {user ? (
              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 bg-white/60 backdrop-blur-md rounded-2xl px-4 py-3 hover:bg-white/80 transition-all duration-300 border border-white/30 shadow-md hover:shadow-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <span className="font-semibold text-gray-700 hidden sm:block">
                    {user.name}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 py-2 z-50">
                    <button
                      onClick={() => {
                        setCurrentPage("profile");
                        setShowDropdown(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-white/60 transition-all duration-200"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </button>
                    <hr className="my-2 border-gray-200/50" />
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50/60 transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage("auth")}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl font-bold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
