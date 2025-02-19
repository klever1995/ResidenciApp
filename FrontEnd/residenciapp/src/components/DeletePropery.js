// src/components/DeleteProperty.js
import React from 'react';
import axios from 'axios';

const DeleteProperty = ({ propertyId, onDelete }) => {
    const handleDelete = async () => {
        try {
            // Realizamos la solicitud DELETE al microservicio de eliminar propiedad
            await axios.delete(`http://localhost:3004/dproperties/${propertyId}`);
            onDelete(propertyId); // Llamamos al callback para actualizar el listado
        } catch (err) {
            console.error('Error al eliminar la propiedad:', err);
        }
    };

    return <button onClick={handleDelete}>Eliminar</button>;
};

export default DeleteProperty;
