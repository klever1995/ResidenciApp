import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar3 from "./navbar3";

const PropertyList = () => {
  const [properties, setProperties] = useState([]); // Aseguramos que sea un arreglo vacío por defecto
  const [ownerName, setOwnerName] = useState(""); // Filtro por nombre del propietario
  const [searchClicked, setSearchClicked] = useState(false); // Estado para manejar el clic en el botón de búsqueda

  // Función para obtener propiedades con los filtros
  const fetchProperties = async (owner) => {
    try {
      let url = "http://localhost:3002/rproperties";
      if (owner) {
        url += `?username=${owner}`; // Buscar solo por nombre del propietario
      }
      // Llamada a la API con el filtro de propietario aplicado
      const response = await axios.get(url);
      setProperties(response.data || []); // Si no hay datos, establecer un arreglo vacío
    } catch (error) {
      console.error("Error al obtener propiedades:", error);
      setProperties([]); // En caso de error, establecer un arreglo vacío
    }
  };

  // Función para manejar el cambio de disponibilidad de la propiedad
  const handleAvailabilityToggle = async (id, isAvailable) => {
    try {
      const updatedProperties = properties.map((property) =>
        property.id === id ? { ...property, is_available: !isAvailable } : property
      );
      setProperties(updatedProperties);

      const newStatus = isAvailable ? "no disponible" : "disponible";
      const response = await axios.put(`http://localhost:3003/update/${id}`, {
        status: newStatus,
      });

      console.log("Propiedad actualizada:", response.data);
    } catch (error) {
      console.error("Error al actualizar la propiedad:", error);
      const updatedProperties = properties.map((property) =>
        property.id === id ? { ...property, is_available: isAvailable } : property
      );
      setProperties(updatedProperties);
    }
  };

  // Función para manejar la eliminación de la propiedad
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3004/dproperty/${id}`);
      console.log("Propiedad eliminada:", response.data);
      fetchProperties(ownerName); // Refrescar la lista después de eliminar
    } catch (error) {
      console.error("Error al eliminar la propiedad:", error);
    }
  };

  useEffect(() => {
    if (searchClicked) {
      fetchProperties(ownerName); // Buscar propiedades con el nombre ingresado
      setSearchClicked(false);
    }
  }, [searchClicked, ownerName]);

  return (
    <div className="container mt-5">
      <div className="position-absolute top-0 w-100">
        <Navbar3 />
      </div><br></br><br></br>
      <h1 className="text-center mb-4">Listado de Propiedades</h1>

      <div className="row mb-4">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre del propietario"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <button
            className="btn btn-primary mt-4"
            onClick={() => setSearchClicked(true)}
          >
            Buscar
          </button>
        </div>
      </div>

      <div className="list-group">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div key={property.id} className="list-group-item list-group-item-action mb-3">
              <h3>{property.title}</h3>
              <p><strong>Dirección:</strong> {property.address}</p>
              <p><strong>Propietario:</strong> {property.usernameOwner}</p>
              <p><strong>Precio:</strong> ${property.price}</p>
              <p><strong>Status:</strong> {property.is_available ? "Disponible" : "No disponible"}</p>

              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-warning"
                  onClick={() => handleAvailabilityToggle(property.id, property.is_available)}
                >
                  {property.is_available ? "Marcar como No Disponible" : "Marcar como Disponible"}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(property.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No se encontraron propiedades.</p>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
