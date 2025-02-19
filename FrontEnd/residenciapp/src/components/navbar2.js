import React from 'react';
import { Link } from 'react-router-dom';

const Navbar2 = () => {
  const studentId = localStorage.getItem("studentId");  // Recuperar el studentId de localStorage

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow">
      <div className="container">
        <a className="navbar-brand" href="/">Real Estate Web - ResidenciApp</a>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/PrincipalStudents">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/listProperties">Properties</a>
            </li>
            <li className="nav-item">
              {studentId ? (
                <Link className="nav-link" to={`/searchInvoices`}>Mis Facturas</Link>
              ) : (
                <span className="nav-link disabled">Facturas (sin ID)</span>
              )}
            </li>
            <li className="nav-item">
              {studentId ? (
                <Link className="nav-link" to={`/comments`}>Tu Comentario</Link>
              ) : (
                <span className="nav-link disabled">Mi Perfil (sin ID)</span>
              )}
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">Sign Out</a>
            </li>
          </ul>
          <span className="navbar-text ms-3 text-light">
            📞 09 986 04056
          </span>
        </div>
      </div>
    </nav>
  );
};


export default Navbar2;
