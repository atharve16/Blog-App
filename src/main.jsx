import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/authContext';
import { BlogProvider } from './context/blogContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BlogProvider>
        <App />
      </BlogProvider>
    </AuthProvider>
  </React.StrictMode>
);
