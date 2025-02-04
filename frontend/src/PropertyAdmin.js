import React, { useState, useEffect } from "react";
import './PropertyAdmin.css';  // Importar el CSS

const API_URL = "http://localhost:3002/properties"; // Asegúrate de que esta URL sea correcta

const PropertyAdmin = () => {
  const [properties, setProperties] = useState([]); // Estado para las propiedades
  const [loading, setLoading] = useState(true); // Estado para la carga de datos
  const [error, setError] = useState(null); // Estado para capturar errores

  useEffect(() => {
    // Hacer la petición a la API
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos recibidos:", data); // Ver los datos en consola
        if (Array.isArray(data) && data.length > 0) {
          setProperties(data); // Almacenar las propiedades en el estado
        } else {
          setProperties([]); // En caso de que no haya propiedades
        }
        setLoading(false); // Marcar que los datos están listos
      })
      .catch((error) => {
        console.error("Error al obtener propiedades:", error);
        setError("No se pudo cargar las propiedades.");
        setLoading(false); // En caso de error, dejar de cargar
      });
  }, []);

  return (
    <div className="property-admin">
      <h2>Administración de Propiedades</h2>

      {loading && <p className="loading">Cargando propiedades...</p>}

      {error && <p className="error">{error}</p>} {/* Mostrar error si ocurre */}

      {properties.length === 0 && !loading && !error && (
        <p>No hay propiedades disponibles.</p>
      )}

      {properties.length > 0 && !loading && !error && (
        <table className="properties-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Dirección</th>
              <th>ID del Propietario</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id}>
                <td>{property.name}</td>
                <td>{property.address}</td>
                <td>{property.owner_id}</td>
                <td>${property.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PropertyAdmin;
