import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate
 
const LoginOwners = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(""); // Estado para el token
  const navigate = useNavigate(); // Inicializamos el hook de navegación

  // Función para redirigir al registro
  const goToRegister = () => {
    navigate("/OwnerCreate"); // Redirige a la página de registro
  };

 
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("authToken", token);
      /*setToken("Autenticación exitosa",token);  // Guardar el token en el estado*/
      setError(""); // Limpiar error si hay éxito
      navigate("/PrincipalOwners");
    } catch (err) {
      setError("Credenciales incorrectas.");
      setToken(""); // Limpiar token si hay error
      console.error(err);
    }
  };
 
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#282c34" }}>
      <div className="card p-5 shadow-lg" style={{ width: "700px", backgroundColor: "#f8f9fa" }}>
        <h2 className="text-center text-primary mb-4">Bienvenido a ResidenciApp</h2>
        <p className="text-center text-muted mb-4">Inicia sesión Owner para acceder</p>
 
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label fw-bold">Email</label>
            <input
              type="text"
              id="username"
              className="form-control form-control-lg"
              placeholder="Ingresa tu correo electrónico"
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
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
 
          {error && <div className="alert alert-danger">{error}</div>}
          {token && <div className="alert alert-success">Token: {token}</div>} {/* Mostrar el token */}
 
          <button type="submit" className="btn btn-primary w-100 btn-lg">Iniciar sesión</button>
          <button
          type="button"
          className="btn btn-link w-100 mt-3"
          onClick={goToRegister} // Función para redirigir al registro
        >
          ¿No tienes una cuenta? Regístrate aquí
        </button>

        </form>
      </div>
    </div>
  );
};
 
export default LoginOwners;