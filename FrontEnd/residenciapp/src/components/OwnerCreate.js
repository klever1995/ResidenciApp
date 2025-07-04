import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const OwnerCreate = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [identityCard, setIdentityCard] = useState(""); 
  const [age, setAge] = useState(""); 
  const [phone, setPhone] = useState(""); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  
      const response = await axios.post("http://localhost:7001/cowners", {
        username,
        email,
        password,
        identity_card: identityCard,
        age,
        phone,
      });

      setSuccess("Propietario creado con éxito.");
      setError(""); 
      setTimeout(() => {
        navigate("/loginOwner"); 
      }, 2000);
    } catch (err) {
      setError("Error al crear el propietario. Por favor, intente nuevamente.");
      setSuccess("");
      console.error(err);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card p-5 shadow-lg" style={{ width: "700px", backgroundColor: "#ffffff" }}>
        <h2 className="text-center text-primary mb-4">Create Owner</h2>

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
            <label htmlFor="identity_card" className="form-label">Identity Card:</label>
            <input
              type="text"
              id="identity_card"
              className="form-control"
              value={identityCard}
              onChange={(e) => setIdentityCard(e.target.value)}
              required
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
              required
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
              required
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <button type="submit" className="btn btn-primary w-100 btn-lg">Save Owner</button>
        </form>
      </div>
    </div>
  );
};

export default OwnerCreate;
