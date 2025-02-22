import axios from 'axios';

const API_URL = 'http://localhost:3002'; // Cambia esto si es necesario

// Obtener todas las propiedades
export const getProperties = async () => {
    try {
        const response = await axios.get(`${API_URL}/rproperties`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las propiedades", error);
        throw error;
    }
};

// Obtener una propiedad por ID
export const getPropertyById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/properties/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener la propiedad", error);
        throw error;
    }
};

// Actualizar el estado de la propiedad
export const updateProperty = async (propertyId, status) => {
    try {
        const response = await axios.put(`${API_URL}/update`, { property_id: propertyId, status });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar la propiedad", error);
        throw error;
    }
};
