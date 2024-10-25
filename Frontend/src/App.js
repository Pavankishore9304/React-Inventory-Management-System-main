import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IntroductionPage from "./pages/introduction";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Inventory from "./pages/Inventory";
import NoPageFound from "./pages/NoPageFound";
import Store from "./pages/Store";
import Sales from "./pages/Sales";
import PurchaseDetails from "./pages/PurchaseDetails";
import AuthContext from "./AuthContext";
import ProtectedWrapper from "./ProtectedWrapper";
import "./index.css";

const App = () => {
  const [user, setUser] = useState(null);

  const signin = (newUser, callback) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify({ _id: newUser }));
    if (callback) callback();
  };

  const signout = (callback) => {
    setUser(null);
    localStorage.removeItem("user");
    if (callback) callback();
  };

  const value = { user, signin, signout };

  return (
    <AuthContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
        <Route path="/introduction" element={<IntroductionPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedWrapper>
                <Layout />
              </ProtectedWrapper>
            } 
          >
             <Route path ="/Dashboard" element={<Dashboard />} /> 
             {/* Dashboard is loaded at the root */}
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/purchase-details" element={<PurchaseDetails />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/manage-store" element={<Store />} />
          </Route>
          <Route path="*" element={<NoPageFound />} />  {/* 404 page */}
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
