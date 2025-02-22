// src/components/ManageReservation.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageReservation = ({ reservationId, userRole }) => {
    const [reservation, setReservation] = useState(null);

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const response = await axios.get(`http://localhost:4002/readreservations/${reservationId}`);
                setReservation(response.data);
            } catch (error) {
                console.error("Error al obtener la reservación", error);
            }
        };
        fetchReservation();
    }, [reservationId]);

    const handleConfirm = async () => {
        if (userRole === 'owner') {
            try {
                await axios.put(`http://localhost:4003/reservations/${reservationId}`, {
                    status: 'confirmed',
                });
                setReservation({ ...reservation, status: 'confirmed' });
            } catch (error) {
                console.error("Error al confirmar la reservación", error);
            }
        }
    };

    const handleCancel = async () => {
        if (userRole === 'owner' || userRole === 'student') {
            try {
                await axios.delete(`http://localhost:4004/dreservations/${reservationId}`);
                setReservation(null); // Reservación eliminada
            } catch (error) {
                console.error("Error al cancelar la reservación", error);
            }
        }
    };

    if (!reservation) return <p>Reservación no encontrada.</p>;

    return (
        <div>
            <h2>Gestionar Reservación</h2>
            <p>ID: {reservation.id}</p>
            <p>Estudiante: {reservation.student_id}</p>
            <p>Propiedad: {reservation.property_id}</p>
            <p>Fecha: {reservation.reservation_date}</p>
            <p>Status: {reservation.status}</p>
            
            {userRole === 'owner' && reservation.status === 'pending' && (
                <button onClick={handleConfirm}>Confirmar Reservación</button>
            )}
            <button onClick={handleCancel}>
                {userRole === 'student' && reservation.status === 'pending' ? 'Cancelar Reservación' : 'Eliminar Reservación'}
            </button>
        </div>
    );
};

export default ManageReservation;
