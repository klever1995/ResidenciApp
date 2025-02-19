import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';  // Asegúrate de importar el Navbar correctamente
import './CreateReservation.css'; // Asegúrate de que el archivo de estilos esté bien vinculado

const CreateReservation = () => {
  const { propertyId } = useParams();
  const [studentName, setStudentName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState(''); // Estado para el mensaje
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  useEffect(() => {
    // Lógica para obtener información adicional si es necesario.
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4001/creservations', {
        student_name: studentName,
        owner_name: ownerName,
        reservation_date: reservationDate,
        status: status,
      });

      setMessage('Reservación creada con éxito. Revisa la pestaña "Mis Facturas" para realizar el pago.');
      navigate('/PrincipalStudents');
    } catch (error) {
      setMessage('Hubo un error al crear la reservación. Por favor, inténtalo nuevamente.');
    }
  };

  const handleCancelReservation = () => {
    setMessage('Reservación cancelada con éxito.');
    navigate('/ListProperties', { replace: true });
  };

  return (
    <div className="reservation-container">
      {/* Navbar (Navegación) */}
      <Navbar /><br></br><br></br><br></br>

      <div className="reservation-content">
        <h2 className="reservation-title">Crear Reservación</h2>
        
        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="form-group">
            <label htmlFor="studentName">Nombre Estudiante:</label>
            <input
              id="studentName"
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ownerName">Nombre Propietario:</label>
            <input
              id="ownerName"
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reservationDate">Fecha de Reservación:</label>
            <input
              id="reservationDate"
              type="date"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              required
              className="form-control"
            />
          </div>

          {role === 'owner' && (
            <div className="form-group">
              <label htmlFor="status">Estado:</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-control"
              >
                <option value="pending">Pendiente</option>
                <option value="confirmed">Confirmado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Crear Reservación</button>
            
          </div>
        </form>

        {role === 'student' && (
          <div className="cancel-action">
            <button onClick={handleCancelReservation} className="btn btn-danger">Cancelar Reservación</button>
          </div>
        )}

        {/* Mostrar el mensaje si existe */}
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  );
};

export default CreateReservation;
