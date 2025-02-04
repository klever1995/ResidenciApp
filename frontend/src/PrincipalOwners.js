import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate

const PrincipalOwners = () => {
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card p-5 shadow-lg" style={{ width: "700px", backgroundColor: "#ffffff" }}>
        <h2 className="text-center text-primary mb-4">Bienvenido al Centro de Reservas Estudiantil</h2>
        <p className="text-center text-muted">Puedes recomendar tus propiedades a estudiante universitarios que llegan de distintas partes del país.</p>
      </div>
    </div>
  );
};

export default PrincipalOwners;
