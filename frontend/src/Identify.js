import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSelector = () => {
  const [userType, setUserType] = useState(''); // Guarda si es estudiante o propietario
  const navigate = useNavigate(); // Redirige después de elegir el tipo de usuario

  const handleUserTypeChange = (type) => {
    setUserType(type);
    // Redirige inmediatamente al seleccionar el tipo de usuario
    if (type === 'student') {
      navigate('/LoginStudents');
    } else if (type === 'owner') {
      navigate('/LoginOwners');
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card p-5 shadow-lg" style={{ width: "600px", backgroundColor: "#ffffff", borderRadius: "10px" }}>
        <div className="login-selector">
          <h2 className="text-center mb-4" style={{ color: "#343a40" }}>Selecciona tu tipo de usuario</h2>
          
          <div className="d-flex justify-content-around mb-4">
            <button 
              onClick={() => handleUserTypeChange('student')}
              className={`btn ${userType === 'student' ? 'btn-primary' : 'btn-outline-primary'} btn-lg w-45`}>
              Student
            </button>
          
            <button
              onClick={() => handleUserTypeChange('owner')}
              className={`btn ${userType === 'owner' ? 'btn-primary' : 'btn-outline-primary'} btn-lg w-45`}>
             Owner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSelector;
