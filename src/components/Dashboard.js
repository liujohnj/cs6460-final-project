import { updateCurrentUser } from 'firebase/auth';
import React, { useState } from 'react';
import { Card, Button, Alert, Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError('');
    try {
      await logout();
      navigate('/login');
    } catch {
      setError('Failed to log out');
    }
  }

  return (
    <div className="grid grid-cols-1 h-screen w-full">
      <div className="bg-white flex flex-col justify-center">
        <div className="max-w-[440px] text-lg w-full mx-auto p-4">
          ACTIVE COURSES
        </div>
        <div className="max-w-[400px] w-full mx-auto bg-gray-200 p-4">
          <div className="flex flex-shrink-0 items-center">
            <img
              className="object-fit w-[400px] border-2 border-indigo-700"
              src="../cs6460.png"
              alt="Your Company"
            />
          </div>
          <h6 className="text-lg">CS6460: Educational Technology (SP23)</h6>
          <p className="text-sm text-gray-600">Spring 2023</p>
          <Link to="/search">
            <button className="border w-full my-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white">
              Enter
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard