import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const StudentCreate = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState(""); // Nueva variable
  const [career, setCareer] = useState(""); // Nueva variable
  const [birthdate, setBirthdate] = useState(""); // Nueva variable
  const [age, setAge] = useState(""); // Nueva variable
  const [identityCard, setIdentityCard] = useState(""); // Nueva variable
  const [phone, setPhone] = useState(""); // Nueva variable
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviar los datos del usuario al backend para crear el estudiante
      const response = await axios.post("http://localhost:6001/cstudents", {
        username,
        email,
        password,
        university,
        career,
        birthdate,
        age,
        identity_card: identityCard,
        phone,
      });

      setSuccess("Estudiante creado con éxito.");
      setError(""); // Limpiar errores en caso de éxito
      setTimeout(() => {
        navigate("/LoginStudents"); // Redirigir al login para entrar a la app
      }, 2000);
    } catch (err) {
      setError("Error al crear el estudiante. Por favor, intente nuevamente.");
      setSuccess(""); // Limpiar el mensaje de éxito en caso de error
      console.error(err);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card p-5 shadow-lg" style={{ width: "700px", backgroundColor: "#ffffff" }}>
        <h2 className="text-center text-primary mb-4">Create Student</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Name:</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="university" className="form-label">University:</label>
            <input
              type="text"
              id="university"
              className="form-control"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="career" className="form-label">Career:</label>
            <input
              type="text"
              id="career"
              className="form-control"
              value={career}
              onChange={(e) => setCareer(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="birthdate" className="form-label">Birthdate:</label>
            <input
              type="date"
              id="birthdate"
              className="form-control"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="age" className="form-label">Age:</label>
            <input
              type="number"
              id="age"
              className="form-control"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="identity_card" className="form-label">Identity Card:</label>
            <input
              type="text"
              id="identity_card"
              className="form-control"
              value={identityCard}
              onChange={(e) => setIdentityCard(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone Number:</label>
            <input
              type="text"
              id="phone"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <button type="submit" className="btn btn-primary w-100 btn-lg">Save User</button>
        </form>
      </div>
    </div>
  );
};

export default StudentCreate;
