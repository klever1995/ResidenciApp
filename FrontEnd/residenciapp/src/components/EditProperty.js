// src/components/EditProperty.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProperty = ({ propertyId }) => {
    const [property, setProperty] = useState({
        title: '',
        address: '',
        price: '',
        description: '',
        status: 'disponible',
        city: '',
        usernameOwner: '',
        image: null
    });

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axios.get(`http://localhost:3003/properties/${propertyId}`);
                setProperty(response.data);
            } catch (err) {
                console.error('Error al obtener la propiedad:', err);
            }
        };

        fetchProperty();
    }, [propertyId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProperty({
            ...property,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setProperty({
            ...property,
            image: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', property.title);
        formData.append('address', property.address);
        formData.append('price', property.price);
        formData.append('description', property.description);
        formData.append('status', property.status);
        formData.append('city', property.city);
        formData.append('usernameOwner', property.usernameOwner);
        if (property.image) {
            formData.append('image', property.image);
        }

        try {
            // Realizamos la solicitud PUT al microservicio de actualizar propiedad
            const response = await axios.put(`http://localhost:3003/update/${propertyId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
        } catch (err) {
            console.error('Error al actualizar la propiedad:', err);
        }
    };

    return (
        <div>
            <h2>Editar Propiedad</h2>
            <form onSubmit={handleSubmit}>
                {/* Aquí van los mismos campos de input que en el formulario de creación */}
                {/* ... */}
                <button type="submit">Actualizar Propiedad</button>
            </form>
        </div>
    );
};

export default EditProperty;
