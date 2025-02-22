import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPropertyById } from '../services/propertyService';

const PropertyDetail = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const data = await getPropertyById(id);
                setProperty(data);
            } catch (error) {
                console.error("Error al obtener la propiedad", error);
            }
        };
        fetchProperty();
    }, [id]);

    return (
        property ? (
            <div>
                <h2>{property.title}</h2>
                <p>{property.address}</p>
                <p>{property.city}</p>
                <p>{property.description}</p>
                <p>Precio: {property.price} USD</p>
                <p>Estado: {property.is_available}</p>
                <button onClick={() => alert("Reserva esta propiedad")}>Reservar</button>
            </div>
        ) : (
            <p>Cargando...</p>
        )
    );
};

export default PropertyDetail;
