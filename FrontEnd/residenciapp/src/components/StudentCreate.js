import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const StudentCreate = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    university: "",
    career: "",
    birthdate: "",
    age: "",
    identity_card: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos
    if (!formData.username || !formData.email || !formData.password || !formData.university || !formData.career || !formData.birthdate || !formData.age || !formData.identity_card || !formData.phone) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (isNaN(formData.age) || formData.age <= 0) {
      setError("La edad debe ser un número positivo.");
      return;
    }

    // Verifica que la fecha de nacimiento tenga un formato válido
    const birthdateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthdateRegex.test(formData.birthdate)) {
      setError("La fecha de nacimiento debe tener el formato YYYY-MM-DD.");
      return;
    }

    // Mostrar los datos que se enviarán
    console.log('Datos enviados:', formData);

    try {
      // Realizar la solicitud POST con los datos validados
      await axios.post("http://localhost:6001/cstudents", formData, {
        headers: {
          "Content-Type": "application/json", // Asegura que se envíen como JSON
        },
      });
      setSuccess("Estudiante creado con éxito.");
      setError("");

      setTimeout(() => navigate("/LoginStudent"), 2000);
    } catch (err) {
      console.error('Error al crear el estudiante:', err);
      setError("Error al crear el estudiante. Intente nuevamente.");
      setSuccess("");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f4f4f4" }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="text-center text-primary mb-4">Registro de Estudiante</h3>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Universidad</label>
              <input
                type="text"
                name="university"
                className="form-control"
                value={formData.university}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Carrera</label>
              <input
                type="text"
                name="career"
                className="form-control"
                value={formData.career}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Fecha de Nacimiento</label>
              <input
                type="date"
                name="birthdate"
                className="form-control"
                value={formData.birthdate}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Edad</label>
              <input
                type="number"
                name="age"
                className="form-control"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Cédula de Identidad</label>
              <input
                type="text"
                name="identity_card"
                className="form-control"
                value={formData.identity_card}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Teléfono</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <div className="alert alert-danger text-center">{error}</div>}
          {success && <div className="alert alert-success text-center">{success}</div>}

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Guardar Estudiante
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentCreate;
