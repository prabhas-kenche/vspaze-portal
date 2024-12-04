import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importing eye icons

import "./index.css";

const Login = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!employeeId.trim() || !password.trim()) {
      return alert("Please fill in both Employee ID and Password.");
    }

    try {
      const docRef = doc(db, "employees", employeeId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Create new employee entry if not found
        const loginTime = Timestamp.now();
        await setDoc(docRef, {
          employeeName,
          loginTime,
          tasks: [],
        });
      }

      // Navigate to TaskScheduler with employee data
      navigate("/tasks", { state: { employeeId, employeeName } });
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="login flex flex-col items-center justify-center h-screen bg-gray-100">
      <img
        src="https://res.cloudinary.com/dagkvnqd9/image/upload/v1732282945/Screenshot_22-11-2024_181656__f7zlla.jpg"
        alt="Company Logo"
        className="company-logo w-40 mb-8"
      />
      <h1 className="text-xl font-bold mt-4 mb-4">Employee Portal</h1>

      <input
        type="text"
        placeholder="Enter Employee ID"
        className="border-2 p-2 rounded w-64 mb-4"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      />
      <div className="relative w-64 mb-4">
        <input
          type={showPassword ? "text" : "password"} // Toggle between text and password type
          placeholder="Enter Password"
          className="border-2 p-2 rounded w-full pr-10" // Add padding on the right to make space for the icon
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div
          onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
          className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
        >
          {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </div>
      </div>

      <button
        onClick={handleLogin}
        className="login-button text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
};

export default Login;
