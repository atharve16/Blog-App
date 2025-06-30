import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Edit2,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../context/authContext";

const UserProfile = ({ setCurrentPage }) => {
  const { user, updateUserProfile, deleteUserAccount, authApi, logout } =
    useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [userDetails, setUserDetails] = useState(null);

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user && user.email) {
        try {
          // Get all users and find current user by email
          const allUsers = await authApi.getAllUsers();
          const currentUser = allUsers.find((u) => u.email === user.email);
          if (currentUser) {
            setUserDetails(currentUser);
            setFormData({
              name: currentUser.name || "",
              email: currentUser.email || "",
              password: "",
              confirmPassword: "",
            });
          }
        } catch (err) {
          console.error("Error fetching user details:", err);
          setError("Failed to load user details");
        }
      }
    };

    fetchUserDetails();
  }, [user, authApi]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Name and email are required");
      setLoading(false);
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        id: userDetails.id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password || userDetails.password, // Keep existing password if not changed
      };

      await updateUserProfile(updateData);

      // Update local user details
      setUserDetails((prev) => ({
        ...prev,
        name: updateData.name,
        email: updateData.email,
      }));

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userDetails?.id) return;

    setLoading(true);
    setError("");

    try {
      await deleteUserAccount(userDetails.id);
      setSuccess("Account deleted successfully!");
      // User will be logged out automatically in the deleteUserAccount function
      setTimeout(() => {
        setCurrentPage("home");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to delete account");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: userDetails?.name || "",
      email: userDetails?.email || "",
      password: "",
      confirmPassword: "",
    });
    setError("");
    setSuccess("");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              Please log in to view your profile.
            </p>
            <button
              onClick={() => setCurrentPage("auth")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userDetails?.name?.charAt(0) || "U"}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {userDetails?.name || "Loading..."}
                </h1>
                <p className="text-blue-100">{userDetails?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Profile Information
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isEditing ? "bg-gray-50 text-gray-600" : "bg-white"
                }`}
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isEditing ? "bg-gray-50 text-gray-600" : "bg-white"
                }`}
                placeholder="Enter your email address"
              />
            </div>

            {/* Password Fields - Only show when editing */}
            {isEditing && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    New Password (leave blank to keep current)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm new password"
                  />
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex space-x-4 mt-8">
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>
              <button
                onClick={cancelEdit}
                className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Danger Zone
          </h3>
          <p className="text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium mb-4">
                Are you absolutely sure you want to delete your account?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Yes, Delete Account"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <button
            onClick={() => setCurrentPage("home")}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
