import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar2 from "./navbar2"; 

const PrincipalStudents = () => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center vh-100"
      style={{
        backgroundImage: "url('https://images.adsttc.com/media/images/5733/92ba/e58e/cee8/0800/004f/large_jpg/02.jpg?1462997678')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {/* Navbar */}
      <div className="position-absolute top-0 w-100">
        <Navbar2 />
      </div>

      {/* Capa de fondo semi-transparente */}
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.5 }}></div>

      {/* Contenido */}
      <div className="position-relative text-white px-4">
        <h1 className="display-4 fw-bold text-shadow">Hey!! Take advantage of our services!</h1>
        <h2 className="mt-3 text-shadow">You can enter the properties tab to reserve yours</h2>
      </div>

      {/* Redes sociales */}
      <div className="position-fixed top-50 start-0 translate-middle-y ms-3">
        <a href="#" className="d-block mb-3 text-white fs-3 social-icon">
          <i className="bi bi-facebook"></i>
        </a>
        <a href="#" className="d-block mb-3 text-white fs-3 social-icon">
          <i className="bi bi-instagram"></i>
        </a>
        <a href="#" className="d-block mb-3 text-white fs-3 social-icon">
          <i className="bi bi-youtube"></i>
        </a>
      </div>

      {/* Estilos adicionales */}
      <style>
        {`
          .text-shadow {
            text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7);
          }
          .social-icon:hover {
            transform: scale(1.1);
            transition: 0.3s;
          }
        `}
      </style>
    </div>
  );
};

export default PrincipalStudents;
