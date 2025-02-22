import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar2 from "./navbar2";
import { useNavigate } from "react-router-dom";

const FilteredProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [role, setRole] = useState("student"); // Suponiendo que el rol es estudiante, puedes ajustarlo según la autenticación.
  const navigate = useNavigate(); 

  useEffect(() => {
    axios.get("http://localhost:3002/rproperties") 
      .then((res) => setProperties(res.data))
      .catch((error) => console.error("Error getting properties:", error));
  }, []);

  const handleFilter = () => {
    const filtered = properties.filter(
      (property) =>
        (city === "" || property.city?.toLowerCase() === city.toLowerCase()) &&
        (propertyType === "" || property.title?.toLowerCase() === propertyType.toLowerCase())
    );
    setFilteredProperties(filtered);
  };

  const handleReserve = (propertyId) => {
    navigate(`/CreateReservation/${propertyId}`);
  };

  return (
    <div>
      <Navbar2 />

      {/* Hero Section */}
      <div 
        className="position-relative text-center text-white" 
        style={{
          backgroundImage: "url('https://www.bbva.com/wp-content/uploads/2022/09/piso-compartido-residencia-estudiantes-BBVA-salud-financiera.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "500px",
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column justify-content-center align-items-center">
          <h1 className="fw-bold display-5">Rooms and apartments.</h1>
          <h2 className="fs-3 mt-2">At the best price.</h2>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mt-n4 position-relative z-1">
        <div className="bg-white shadow-lg p-4 rounded-3">
          <h3 className="text-center fw-bold mb-4">Find the property you are looking for</h3>
          <div className="row g-3">
            <div className="col-md-4">
              <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">Select City</option>
                <option value="Quito">Quito</option>
                <option value="Guayaquil">Guayaquil</option>
                {/* Agregar más opciones */}
              </select>
            </div>
            <div className="col-md-4">
              <select className="form-select" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                <option value="">Property Type</option>
                <option value="Departamento">Department</option>
                <option value="Habitación">Room</option>
              </select>
            </div>
            <div className="col-md-4">
              <button className="btn btn-danger w-100" onClick={handleFilter}>Search</button>
            </div>
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div className="container mt-5">
        <h3 className="text-center fw-bold">Available Properties</h3>
        <div className="row">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div key={property.id} className="col-md-4">
                <div className="card mb-4 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{property.title}</h5>
                    <p className="card-text"><strong>City:</strong> {property.city}</p>
                    <p className="card-text"><strong>Type:</strong> {property.title}</p>
                    <p className="card-text"><strong>Description:</strong> {property.description}</p>
                    <p className="card-text"><strong>Address:</strong> {property.address}</p>
                    <p className="card-text"><strong>Price:</strong> ${property.price}</p>
                    <p className="card-text"><strong>Owner:</strong> {property.usernameOwner || "Not available"}</p>

                    {/* Show Reserve Button for students */}
                    {role === "student" && (
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleReserve(property.id)}
                      >
                        Reserve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center mt-4">No properties available with the selected criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilteredProperties;
