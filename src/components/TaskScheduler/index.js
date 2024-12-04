import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { db } from "../../firebase";
import "./index.css";

const TaskScheduler = () => {
  const [tasks, setTasks] = useState([{ name: "", details: "" }]); // Tasks list
  const [projects, setProjects] = useState([{ name: "", tasks: "" }]); // Projects list
  const [loginTime, setLoginTime] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeId, employeeName } = location.state || {};

  // Fetch employee data and validate access
  useEffect(() => {
    if (!employeeId) {
      alert("Invalid access. Redirecting to login.");
      navigate("/login");
      return;
    }

    const fetchEmployeeData = async () => {
      try {
        const docRef = doc(db, "employees", employeeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLoginTime(docSnap.data().loginTime);
        } else {
          alert("Employee not found. Redirecting to login.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, [employeeId, navigate]);

  // Handle task input changes
  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  // Handle project name changes
  const handleProjectNameChange = (index, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index].name = value;
    setProjects(updatedProjects);
  };

  // Handle project tasks input changes with dynamic resizing
  const handleProjectTaskChange = (index, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index].tasks = value;
    setProjects(updatedProjects);

    const textarea = document.querySelectorAll(".texts")[index];
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height to content
    }
  };

  // Handle Enter key to add numbered points in the project tasks
  const handleEnterKey = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default action

      const currentTasks = projects[index].tasks.split("\n");
      currentTasks.push(`${currentTasks.length + 1}. `);

      const updatedProjects = [...projects];
      updatedProjects[index].tasks = currentTasks.join("\n");
      setProjects(updatedProjects);
    }
  };

  // Add a new project
  const addProject = () => {
    setProjects([...projects, { name: "", tasks: "" }]);
  };

  // Handle logout
  const handleLogout = async () => {
    if (tasks.some((task) => !task.name.trim() || !task.details.trim())) {
      return alert("Please complete all task details before logging out.");
    }

    const logoutTime = Timestamp.now();
    const totalTime = logoutTime.seconds - loginTime.seconds;

    const emailData = {
      employeeId,
      employeeName,
      loginTime: loginTime.toDate().toLocaleString(),
      logoutTime: logoutTime.toDate().toLocaleString(),
      tasks: tasks
        .map((task) => `${task.name}: ${task.details}`)
        .join(", "),
      totalTime: `${Math.floor(totalTime / 3600)}h ${Math.floor(
        (totalTime % 3600) / 60
      )}m ${totalTime % 60}s`,
    };

    try {
      const docRef = doc(db, "employees", employeeId);
      await updateDoc(docRef, {
        tasks,
        logoutTime,
        totalTime,
      });

      await emailjs.send(
        "service_1rq69n4",
        "template_fkj3mgi",
        emailData,
        "2lac-Ehhzk3CAinME"
      );

      alert("Tasks sent via email. Logging out...");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="task-container">
      {/* Header Section */}
      <img
        src="https://res.cloudinary.com/dagkvnqd9/image/upload/v1732282945/Screenshot_22-11-2024_181656__f7zlla.jpg"
        alt="Company Logo"
        className="company-logo2 w-40 mb-8"
      />

      {/* Project Section */}
      <div className="container">
        <div className="mt-2">
        <div className="employee-details">
            <p className="emp-name">{employeeName || "Employee Name Not Available"}</p>
            <p className="emp-id">Employee ID: {employeeId || "ID Not Available"}</p>
          </div>
          <h2 className="day-schedule text-2xl font-bold text-center mb-4">
            Monday - November - 2024
          </h2>
          <div className="tasks-container mb-4">
            <h3 className="text-xl font-semibold mb-4">Work Schedule</h3>
            {projects.map((project, index) => (
              <div key={index} className="mb-6">
                {/* Project Name */}
                <input
                  type="text"
                  placeholder={`Project Name #${index + 1}`}
                  value={project.name}
                  onChange={(e) => handleProjectNameChange(index, e.target.value)}
                  className="w-full p-2 rounded-md border border-gray-300 mb-2"
                />

                {/* Project Tasks */}
                <textarea
                  placeholder={`Activities for ${project.name || `Project #${index + 1}`}`}
                  value={project.tasks}
                  onChange={(e) => handleProjectTaskChange(index, e.target.value)}
                  onKeyDown={(e) => handleEnterKey(e, index)}
                  className="texts w-full p-2 rounded-md border border-gray-300 resize-none overflow-hidden"
                  style={{ height: "auto" }}
                  ref={(textarea) => {
                    if (textarea) {
                      textarea.style.height = "auto";
                      textarea.style.height = `${textarea.scrollHeight}px`;
                    }
                  }}
                />
              </div>
            ))}

            {/* Add Project Button */}
            <div className="buttons flex space-x-4 mt-4">
              <button
                onClick={addProject}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>

        {/* Task Section */}
        <div className="tasks-container mt-8">
          <h3>Tasks of the Day</h3>
          {tasks.map((task, index) => (
            <div key={index} className="mb-6">
              {/* Task Name */}
              <input
                type="text"
                placeholder={`Task Name #${index + 1}`}
                value={task.name}
                onChange={(e) => handleTaskChange(index, "name", e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300 mb-2"
              />

              {/* Task Details */}
              <textarea
                placeholder={`Details for Task #${index + 1}`}
                value={task.details}
                onChange={(e) => handleTaskChange(index, "details", e.target.value)}
                className="texts w-full p-2 rounded-md border border-gray-300 resize-none overflow-hidden"
                style={{ height: "auto" }}
              />
            </div>
          ))}

          {/* Buttons */}
          <div className="buttons mt-4 flex justify-center space-x-4">
            <button
              onClick={() => setTasks([...tasks, { name: "", details: "" }])}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Add Task
            </button>
            <button
              onClick={handleLogout}
              className="ml-2 bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskScheduler;
