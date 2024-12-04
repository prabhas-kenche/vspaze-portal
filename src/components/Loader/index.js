import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


import './index.css'
const Loader = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  }, [navigate]);

  return (
    <div className="loader flex items-center justify-center h-screen bg-gray-100">
      <img
        src="https://res.cloudinary.com/dagkvnqd9/image/upload/v1730476962/WhatsApp_Image_2024-11-01_at_9.29.37_PM-removebg-preview_mmdbvt.png" // Ensure the logo path is correct
        alt="VSpaze Logo"
        className="loader-image w-40 h-40 mx-auto"
      />
    </div>
  );
};

export default Loader;
