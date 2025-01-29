import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("authToken", token);
      console.log("Token:", token);
    } catch (err) {
      setError("Credenciales incorrectas.");
      console.error(err);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#282c34" }}>
      <div className="card p-5 shadow-lg" style={{ width: "700px", backgroundColor: "#f8f9fa" }}>
        <h2 className="text-center text-primary mb-4">Bienvenido a ResidenciApp</h2>
        <p className="text-center text-muted mb-4">Inicia sesión para acceder</p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="form-label fw-bold">Usuario</label>
            <input
              type="text"
              id="username"
              className="form-control form-control-lg"
              placeholder="Ingresa tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-bold">Contraseña</label>
            <input
              type="password"
              id="password"
              className="form-control form-control-lg"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-primary w-100 btn-lg">Iniciar sesión</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
