import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar2 from './navbar2';

const SearchInvoices = () => {
  const [username, setUsername] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    if (!username.trim()) {
      setMessage('Por favor, ingrese el nombre del estudiante.');
      return;
    }
    
    try {
      const { data } = await axios.get(`http://127.0.0.1:5002/invoices/search?username=${username}`);
      setInvoices(data);
      setMessage(data.length ? '' : 'No se encontraron facturas.');
    } catch (error) {
      console.error('Error al buscar facturas:', error.response?.data || error.message);
      setMessage('Hubo un error al obtener las facturas.');
    }
  };

  const handlePayment = async (invoice) => {
    try {
      const paymentData = {
        student_id: invoice.student_id,
        amount: invoice.amount,
        status: 'paid',
      };
      
      const response = await axios.post('http://127.0.0.1:9002/payments/generate', paymentData);
      
      if (response.status === 201) {
        setInvoices(invoices.map(i => i.id === invoice.id ? { ...i, status: 'paid' } : i));
        setMessage('Pago realizado exitosamente.');
      } else {
        setMessage(response.data?.error || 'Error al procesar el pago.');
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error.response?.data || error.message);
      setMessage('Hubo un error al procesar el pago.');
    }
  };

  return (
    <div className="container mt-5 bg-light p-5">
      <div className="position-absolute top-0 w-100">
        <Navbar2 />
      </div> <br></br><br></br>
      <h2 className="text-center mb-4 text-primary">Gestión de Facturas</h2>
      
      <div className="d-flex justify-content-center mb-4">
        <div className="input-group w-50">
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Ingrese el nombre del estudiante" 
            className="form-control" 
          />
          <button onClick={handleSearch} className="btn btn-primary">
            <i className="bi bi-search"></i> Buscar
          </button>
        </div>
      </div>

      {message && <div className="alert alert-info text-center">{message}</div>}

      {invoices.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-light">
              <tr>
                <th>ID Factura</th>
                <th>Monto</th>
                <th>Fecha de Emisión</th>
                <th>Estado</th>
                <th>Estudiante</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>${invoice.amount}</td>
                  <td>{new Date(invoice.issued_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${invoice.status === 'unpaid' ? 'bg-warning' : 'bg-success'}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>{invoice.username}</td>
                  <td>
                    {invoice.status === 'unpaid' && (
                      <button onClick={() => handlePayment(invoice)} className="btn btn-success btn-sm">
                        <i className="bi bi-credit-card"></i> Pagar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SearchInvoices;
