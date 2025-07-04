import React from "react";

const Navbar3 = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow">
      <div className="container">
        <a className="navbar-brand" href="/">Real Estate Web- ResidenciApp</a>
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
              <a className="nav-link" href="/PrincipalOwners">Home</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                   Properties
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><a className="dropdown-item" href="/CreateProperty">Create Property</a></li>
               <li><a className="dropdown-item" href="/PropertyList">List Property</a></li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">Sing Out</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Contacto</a>
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

export default Navbar3;
