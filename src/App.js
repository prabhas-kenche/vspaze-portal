import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import TaskScheduler from "./components/TaskScheduler";
import Summary from "./components/Summary";

const App = () => (
  <div className="app bg-gray-100 min-h-screen">
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/tasks" element={<TaskScheduler />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
