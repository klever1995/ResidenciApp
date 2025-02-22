import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const LoginOwners = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirigir a la página de registro
  const goToRegister = () => {
    navigate("/OwnerCreate");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });

      console.log("📩 Backend response:", response.data); // 🔍 Depuración

      const { token, owner_id, owner_name } = response.data;

      if (!token || !owner_id) {
        throw new Error("❌ Backend response failed. Missing token or owner_id.");
      }

      // Guardamos en localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("owner_id", owner_id);
      if (owner_name) {
        localStorage.setItem("owner_name", owner_name);
      }

      console.log("✅ Data saved in localStorage:", {
        token,
        owner_id,
        owner_name,
      });

      setSuccessMessage(`Welcome, ${owner_name || "Owner"}!`);
      
      // Redirigir a la página principal después de 1.5 segundos
      setTimeout(() => {
        navigate("/principalOwners");
      }, 1500);

    } catch (err) {
      console.error("❌ Error en el login:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Incorrect credentials or server problem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#282c34" }}>
      <div className="card p-5 shadow-lg" style={{ width: "700px", backgroundColor: "#f8f9fa" }}>
        <h2 className="text-center text-primary mb-4">Welcome to ResidenciaApp</h2>
        <p className="text-center text-muted mb-4">Log in as Owner to access</p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label fw-bold">Email</label>
            <input
              type="email"
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
              className="form-control form-control-lg"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <button type="submit" className="btn btn-primary w-100 btn-lg" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
          <button type="button" className="btn btn-link w-100 mt-3" onClick={goToRegister}>
          Don't have an account? Register here
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginOwners;
