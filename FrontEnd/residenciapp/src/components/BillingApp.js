import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Navbar3 from "./navbar3";

const BillingApp = () => {
  const [invoices, setInvoices] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    id: "",
    student_id: "",
    reservation_id: "",
    amount: "",
    status: "Pending",
  });
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
    fetchStudents();
  }, []);

  // 🔹 Cargar todas las facturas
  const fetchInvoices = async () => {
    try {
      const response = await axios.get("http://localhost:5002/invoice");
      setInvoices(response.data);
    } catch (error) {
      console.error("Error obtaining invoices:", error);
    }
  };


  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:6002/rstudents");
      setStudents(response.data);
    } catch (error) {
      console.error("Error getting students:", error);
    }
  };


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStudentChange = (e) => {
    const selectedStudent = students.find((s) => s.username === e.target.value);
    setForm({ ...form, student_id: selectedStudent ? selectedStudent.id : "" });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`http://localhost:5003/invoice/${form.id}`, form);
      } else {
        await axios.post("http://localhost:5001/invoice", form);
        alert("Excellently created invoice ✅");
      }
      setForm({ id: "", student_id: "", reservation_id: "", amount: "", status: "Pending" });
      setEditing(false);
      fetchInvoices();
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  // 🔹 Cargar datos para editar
  const handleEdit = (invoice) => {
    setForm(invoice);
    setEditing(true);
  };

  // 🔹 Eliminar una factura
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5004/invoice/${id}`);
      fetchInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  return (
    <div className="container mt-4 bg-cover bg-center" style={{ backgroundImage: 'url("https://img.freepik.com/fotos-premium/fondo-gradiente-azul-espacio-copia_1179130-621454.jpg")' }}>
      <Navbar3/><br></br><br></br>
      <div className="row mb-4">
        <div className="col-md-12 text-center">
          <h2 className="text-white">Invoice Management</h2>
          <p className="lead text-white-50">Manage student invoices and reservations</p>
        </div>
      </div>

      {/* Formulario de creación y actualización de factura */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h5>{editing ? "Editar Factura" : "Crear Nueva Factura"}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="student_id" className="form-label">Student</label>
              <select
                name="student_id"
                onChange={handleStudentChange}
                className="form-select"
                required
              >
                <option value="">Select your student username</option>
                {students.map((student) => (
                  <option key={student.id} value={student.username}>
                    {student.username}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="reservation_id" className="form-label">Reservation ID</label>
              <input
                type="text"
                name="reservation_id"
                placeholder="ID de Reserva"
                value={form.reservation_id}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="amount" className="form-label">Price</label>
              <input
                type="number"
                name="amount"
                placeholder="Monto"
                value={form.amount}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Pendiente">Pending</option>
                <option value="Pagado">Paid</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              {editing ? "Actualizar" : "Crear"}
            </button>
          </form>
        </div>
      </div>

      {/* Tabla de Facturas */}
      <div className="card shadow-sm">
        <div className="card-header bg-secondary text-white">
          <h5>Invoice List</h5>
        </div>
        <div className="card-body">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>ID Reservation</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.idx_student_id}</td>
                  <td>{invoice.reservation_id}</td>
                  <td>{invoice.amount}</td>
                  <td>{invoice.status}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(invoice)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleDelete(invoice.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingApp;
