import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4003/reservations"); // Ajusta la URL al microservicio de actualizaciones

const Reservations = () => {
  const [reservations, setReservations] = useState([]);

  // Cargar las reservaciones iniciales (llamando a la API)
  useEffect(() => {
    fetch("http://localhost:4002/readreservations") // Ajusta la URL del microservicio de lectura
      .then(response => response.json())
      .then(data => setReservations(data))
      .catch(error => console.error("Error cargando reservaciones:", error));
  }, []);

  // Escuchar actualizaciones en tiempo real
  useEffect(() => {
    socket.on("update_reservation", (updatedReservation) => {
      setReservations(prevReservations =>
        prevReservations.map(reservation =>
          reservation.id === updatedReservation.id
            ? { ...reservation, status: updatedReservation.status }
            : reservation
        )
      );
    });

    return () => {
      socket.off("update_reservation");
    };
  }, []);

    useEffect(() => {
      socket.on('connect', () => {
        console.log('✅ Conectado al WebSocket');
      });
  
      socket.on('disconnect', () => {
        console.log('❌ Desconectado del WebSocket');
      });
  
      return () => socket.disconnect();
    }, []);
  
  return (
    <div>
      <h2>Reservaciones</h2>
      <ul>
        {reservations.map(reservation => (
          <li key={reservation.id}>
            <strong>ID:</strong> {reservation.id} - <strong>Estado:</strong> {reservation.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reservations;
