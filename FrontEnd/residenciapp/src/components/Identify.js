import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginSelector = () => {
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  const handleUserTypeChange = (type) => {
    setUserType(type);
    navigate(type === "student" ? "./loginStudent" : "./loginOwner");
  };

  return (
    <div className="login-selector">
      <Navbar />

      <div className="d-flex justify-content-center align-items-center flex-column min-vh-100 pt-5">
        <div className="card shadow-lg border-0 rounded-3" style={{ width: "450px" }}>
          <div className="card-body p-5">
            <h2 className="mb-4 text-center font-weight-bold text-primary">Choose Your Role</h2>
            <p className="text-center text-muted mb-4">Please select your role to continue</p>
            
            {/* Imagen pequeña antes de los botones */}
            <div className="d-flex justify-content-center mb-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Escudo_de_la_Universidad_Central_del_Ecuador_-_Andr%C3%A9s_Agual.png/640px-Escudo_de_la_Universidad_Central_del_Ecuador_-_Andr%C3%A9s_Agual.png" // Reemplaza con la URL de tu imagen
                alt="Logo" 
                className="img-fluid" 
                style={{ width: '150px', height: '150px' }} // Tamaño de la imagen
              />
            </div>

            <div className="d-flex justify-content-around">
              <button 
                onClick={() => handleUserTypeChange("student")}
                className={`btn btn-lg rounded-pill w-100 ${userType === "student" ? "btn-primary" : "btn-outline-primary"}`}
                style={{ transition: 'all 0.3s ease' }}
              >
                Student
              </button>
              <button
                onClick={() => handleUserTypeChange("owner")}
                className={`btn btn-lg rounded-pill w-100 ms-3 ${userType === "owner" ? "btn-success" : "btn-outline-success"}`}
                style={{ transition: 'all 0.3s ease' }}
              >
                Owner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSelector;
