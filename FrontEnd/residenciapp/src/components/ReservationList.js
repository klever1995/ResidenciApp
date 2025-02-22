import React, { useEffect, useState } from "react";
import { getReservations } from "../services/reservationService";

const ReservationList = () => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        const data = await getReservations();
        setReservations(data);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Reservaciones</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Propiedad</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((res) => (
                        <tr key={res.id}>
                            <td>{res.id}</td>
                            <td>{res.student_name || "N/A"}</td> {/* Ajustado a student_name */}
                            <td>{res.owner_name || "N/A"}</td>   {/* Ajustado a owner_name */}
                            <td>{new Date(res.reservation_date).toLocaleDateString()}</td>
                            <td>{res.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReservationList;
