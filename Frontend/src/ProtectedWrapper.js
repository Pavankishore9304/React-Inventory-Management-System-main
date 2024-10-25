import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";

const ProtectedWrapper = ({ children }) => {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(true); // State to handle loader

  useEffect(() => {
    // Simulate a delay to check authentication status (e.g., if you're fetching user data)
    const checkAuth = () => {
      if (auth.user) {
        setLoading(false);  // User is authenticated, stop loading
      } else {
        setLoading(false);  // No user, stop loading
      }
    };
    checkAuth();
  }, [auth.user]);

  if (loading) {
    // Render a loading screen while checking authentication status
    return <div>Loading...</div>;
  }

  if (!auth.user) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/introduction" replace />;
  }

  // If authenticated, render the children (i.e., protected content)
  return children;
};

export default ProtectedWrapper;
