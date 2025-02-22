import React, { useState } from 'react';
import { updateProperty } from '../services/propertyService';

const PropertyForm = ({ propertyId }) => {
    const [status, setStatus] = useState('disponible');  // Establecer valor predeterminado

    const handleUpdate = async () => {
        try {
            const response = await updateProperty(propertyId, status);
            alert(response);
        } catch (error) {
            alert("Error al actualizar la propiedad");
        }
    };

    return (
        <div>
            <h3>Actualizar Estado de la Propiedad</h3>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="disponible">Disponible</option>
                <option value="no disponible">No Disponible</option>
            </select>
            <button onClick={handleUpdate}>Actualizar Estado</button>
        </div>
    );
};

export default PropertyForm;
