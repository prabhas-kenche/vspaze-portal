import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const Summary = () => {
  const [summaryData, setSummaryData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeId } = location.state || {};

  useEffect(() => {
    if (!employeeId) {
      alert("Invalid access. Redirecting to login.");
      navigate("/login");
      return;
    }

    const fetchSummary = async () => {
      try {
        const docRef = doc(db, "employees", employeeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSummaryData(docSnap.data());
        } else {
          alert("No summary data found. Redirecting to login.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching summary data:", error);
        alert("An error occurred while fetching summary data.");
      }
    };

    fetchSummary();
  }, [employeeId, navigate]);

  if (!summaryData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-semibold">Loading summary...</p>
      </div>
    );
  }

  const { loginTime, logoutTime, totalTime, tasks } = summaryData;

  const formatTotalTime = (totalTimeInSeconds) => {
    const hours = Math.floor(totalTimeInSeconds / 3600);
    const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
    const seconds = totalTimeInSeconds % 60;
    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  };

  return (
    <div className="summary flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Summary</h2>
      <div className="shadow-md rounded p-6 w-80">
        <p>
          <span className="font-bold">Employee ID:</span> {employeeId}
        </p>
        <p>
          <span className="font-bold">Login Time:</span>{" "}
          {loginTime?.toDate().toLocaleString() || "N/A"}
        </p>
        <p>
          <span className="font-bold">Logout Time:</span>{" "}
          {logoutTime?.toDate().toLocaleString() || "N/A"}
        </p>
        <p>
          <span className="font-bold">Total Time Spent:</span>{" "}
          {totalTime ? formatTotalTime(totalTime) : "N/A"}
        </p>
        <div>
          <span className="font-bold">Tasks:</span>
          <ul className="list-disc pl-6">
            {tasks?.length > 0
              ? tasks.map((task, index) => <li key={index}>{task}</li>)
              : <li>No tasks completed.</li>}
          </ul>
        </div>
      </div>
      <button
        onClick={() => navigate("/login")}
        className="btn-primary bg-blue-500 text-white px-4 py-2 mt-6 rounded"
      >
        Back to Login
      </button>
    </div>
  );
};

export default Summary;
