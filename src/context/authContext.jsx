import React, { useState, useEffect, createContext, useContext } from "react";

const AuthContext = createContext();

// Helper function to create Basic Auth header
const createAuthHeader = (email, password) => {
  const credentials = btoa(`${email}:${password}`);
  return `Basic ${credentials}`;
};

const BASE_URL = "http://localhost:8080/api";

const api = {
  login: async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");
      const message = await res.text(); // backend returns plain text
      return { email, password }; // return credentials for use in auth header
    } catch (error) {
      throw new Error("Login failed");
    }
  },

  signup: async (name, email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/user/newUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) throw new Error("Registration failed");
      const message = await res.text();
      return { name, email, password };
    } catch (error) {
      throw new Error("Registration failed");
    }
  },

  logout: async () => {
    try {
      const res = await fetch(`${BASE_URL}/user/logout`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Logout failed");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  },

  getBlogs: async (page = 0, size = 12) => {
    try {
      const res = await fetch(`${BASE_URL}/blogs`);
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data = await res.json();
      const blogs = Array.isArray(data) ? data : [];

      const startIndex = page * size;
      const paginatedBlogs = blogs.slice(startIndex, startIndex + size);

      return {
        blogs: paginatedBlogs,
        totalPages: Math.ceil(blogs.length / size),
        totalBlogs: blogs.length,
      };
    } catch (error) {
      console.error("Error in getBlogs:", error);
      return {
        blogs: [],
        totalPages: 0,
        totalBlogs: 0,
      };
    }
  },

  getBlog: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/blogs/${id}`);
      if (!res.ok) throw new Error("Failed to fetch blog");
      return await res.json();
    } catch (error) {
      console.error("Error in getBlog:", error);
      throw error;
    }
  },

  createBlog: async (title, content, userCredentials) => {
    try {
      const res = await fetch(`${BASE_URL}/blogs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: createAuthHeader(
            userCredentials.email,
            userCredentials.password
          ),
        },
        body: JSON.stringify({
          title,
          content,
          createdAt: new Date().toISOString(), // optional
          updatedAt: new Date().toISOString(), // optional
        }),
      });

      if (!res.ok) throw new Error("Failed to create blog");
      return await res.json();
    } catch (error) {
      throw error;
    }
  },

  updateBlog: async (id, title, content, userCredentials) => {
    try {
      const res = await fetch(`${BASE_URL}/blogs/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: createAuthHeader(
            userCredentials.email,
            userCredentials.password
          ),
        },
        body: JSON.stringify({
          title,
          content,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to update blog");
      return await res.json();
    } catch (error) {
      throw error;
    }
  },

  deleteBlog: async (id, userCredentials) => {
    try {
      const res = await fetch(`${BASE_URL}/blogs/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: createAuthHeader(
            userCredentials.email,
            userCredentials.password
          ),
        },
      });

      if (!res.ok) throw new Error("Failed to delete blog");
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};

// Auth Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser =
        typeof localStorage !== "undefined"
          ? JSON.parse(localStorage.getItem("user") || "null")
          : null;
      setUser(storedUser);
    } catch (error) {
      console.error("Error loading user from storage:", error);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await api.login(email, password);
      setUser(userData);
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Error saving user to storage:", error);
      }
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const userData = await api.signup(name, email, password);
      setUser(userData);
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Error saving user to storage:", error);
      }
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error removing user from storage:", error);
    }
  };

  // Enhanced API object that includes user credentials
  const enhancedApi = {
    ...api,
    createBlog: (title, content) => api.createBlog(title, content, user),
    updateBlog: (id, title, content) =>
      api.updateBlog(id, title, content, user),
    deleteBlog: (id) => api.deleteBlog(id, user),
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        loading,
        api: enhancedApi,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
