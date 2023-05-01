import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/Home";
import Search from "./components/Search";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Login_bku from "./components/Login_bku";
import Dashboard from "./components/Dashboard";
import ForgotPassword from "./components/ForgotPassword";
import UpdateProfile from "./components/UpdateProfile";
import Settings from "./components/Settings";
import PrivateRoutes from "./components/PrivateRoutes";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<UpdateProfile />} path="/update-profile" />
            <Route element={<Settings />} path="/settings" />
            <Route element={<Search />} path="/search"  />
          </Route>
          <Route element={<Dashboard />} path="/" exact />
          <Route element={<Dashboard />} path="/dashboard" />
          <Route element={<Signup />} path="/signup" />
          <Route element={<Login />} path="/login" />
          <Route element={<ForgotPassword />} path="/forgot-password"  />
        </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;
