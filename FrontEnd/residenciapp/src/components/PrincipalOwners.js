import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar3 from "./navbar3";

const PrincipalOwners = () => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center vh-100 text-center position-relative"
      style={{
        backgroundImage: "url('https://www.sendabienesraices.com/backend/web/assets/img/propiedades/1105-1105-31030-Departamentos-de-Lujo-en-el-corazon-de-San-Angelo-al-Norte-de-Merida-_(15).jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Navbar flotante */}
      <div className="position-absolute top-0 w-100">
        <Navbar3 />
      </div>

      {/* Capa de fondo oscura para mejorar la legibilidad */}
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.5 }}></div>

      {/* Contenido */}
      <div className="card p-5 shadow-lg position-relative" style={{ width: "700px", backgroundColor: "#ffffff", borderRadius: "15px" }}>
        <h2 className="text-center text-primary mb-4">Welcome to the Student Reservations Center</h2>
        <p className="text-center text-muted">
          You can recommend your properties to university students who come from different parts of the country.
        </p>
      </div>
    </div>
  );
};

export default PrincipalOwners;
