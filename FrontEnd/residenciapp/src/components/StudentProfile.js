import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentProfile = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    username: '',
    email: '',
    phone: '',
    // Puedes agregar más campos aquí
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch student data on load
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:6002/rstudents/${studentId}`);
        setStudent(response.data);
        setUpdatedData({
          username: response.data.username,
          email: response.data.email,
          phone: response.data.phone,
          // Rellenar otros campos
        });
      } catch (error) {
        console.error('Error al obtener los datos del estudiante', error);
        setMessage('Error al cargar los datos del estudiante.');
      }
    };

    fetchStudent();
  }, [studentId]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://127.0.0.1:6003/upstudents/${studentId}`, updatedData);
      setMessage(response.data.message);
      setStudent({ ...student, ...updatedData }); // Actualiza los datos locales
    } catch (error) {
      console.error('Error al actualizar los datos del estudiante', error);
      setMessage('Error al actualizar los datos.');
    }
  };

  const handleDelete = async () => {
    const confirmation = window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.');
    if (confirmation) {
      try {
        const response = await axios.delete(`http://127.0.0.1:6004/dstudents/${studentId}`);
        setMessage(response.data.message);
        // Redirigir o hacer un logout, dependiendo de tu flujo
      } catch (error) {
        console.error('Error al eliminar el estudiante', error);
        setMessage('Error al eliminar el estudiante.');
      }
    }
  };

  return (
    <div className="container mt-5">
      {message && <div className="alert alert-info">{message}</div>}
      
      {student ? (
        <>
          <h2 className="text-center mb-4 text-primary">Perfil del Estudiante</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Nombre de Usuario</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={updatedData.username}
                onChange={(e) => setUpdatedData({ ...updatedData, username: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={updatedData.email}
                onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Teléfono</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                value={updatedData.phone}
                onChange={(e) => setUpdatedData({ ...updatedData, phone: e.target.value })}
              />
            </div>

            {/* Puedes agregar más campos si es necesario */}

            <button type="button" className="btn btn-primary" onClick={handleUpdate}>
              Actualizar Datos
            </button>
          </form>
          
          <button type="button" className="btn btn-danger mt-3" onClick={handleDelete}>
            Eliminar Cuenta
          </button>
        </>
      ) : (
        <p>Cargando datos del estudiante...</p>
      )}
    </div>
  );
};

export default StudentProfile;
