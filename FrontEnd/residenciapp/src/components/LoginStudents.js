import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate
 
const LoginStudents = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(""); // Estado para el token
  const navigate = useNavigate(); // Inicializamos el hook de navegación

  // Función para redirigir al registro
  const goToRegister = () => {
    navigate("/StudentCreate"); // Redirige a la página de registro
  };

 
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5020/api/auth/login", {
        email,
        password,
      });
      const { token, studentId } = response.data;  // Asumimos que el backend devuelve el studentId
      localStorage.setItem("authToken", token);
      localStorage.setItem("studentId", studentId);  // Guardamos el studentId
      setError(""); // Limpiar error si hay éxito
      navigate("/principalStudents");
    } catch (err) {
      setError("Credenciales incorrectas.");
      setToken(""); // Limpiar token si hay error
      console.error(err);
    }
  };
  
 
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#282c34" }}>
      <div className="card p-5 shadow-lg" style={{ width: "700px", backgroundColor: "#f8f9fa" }}>
        <h2 className="text-center text-primary mb-4">Welcome to ResidenciApp</h2>
        <p className="text-center text-muted mb-4">Sign in to access</p>
 
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label fw-bold">Email</label>
            <input
              type="text"
              id="username"
              className="form-control form-control-lg"
              placeholder="Enter your username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
 
          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-bold">Password</label>
            <input
              type="password"
              id="password"
              className="form-control form-control-lg"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
 
          {error && <div className="alert alert-danger">{error}</div>}
          {token && <div className="alert alert-success">Token: {token}</div>} {/* Mostrar el token */}
 
          <button type="submit" className="btn btn-primary w-100 btn-lg">Sing In</button>
          <button type="button" className="btn btn-link w-100 mt-3" onClick={goToRegister}>
          Don't have an account? Register here
          </button>

        </form>
      </div>
    </div>
  );
};
 
export default LoginStudents;
 