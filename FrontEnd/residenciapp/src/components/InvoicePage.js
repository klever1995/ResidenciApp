import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


const SearchInvoices = () => {
  const [username, setUsername] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    if (!username) {
      setMessage('Por favor, ingrese el nombre del estudiante.');
      return;
    }
    
    try {
      const response = await axios.get(`http://127.0.0.1:5002/invoices/search?username=${username}`);
      setInvoices(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error al buscar facturas:', error);
      setMessage('Hubo un error al obtener las facturas.');
    }
  };

  return (
    <div>
      <h2>Buscar Facturas</h2>
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="Ingresa el nombre del estudiante" 
      />
      <button onClick={handleSearch}>Buscar</button>
      {message && <p>{message}</p>}
      
      <table>
        <thead>
          <tr>
            <th>ID Factura</th>
            <th>Monto</th>
            <th>Fecha de Emisión</th>
            <th>Estado</th>
            <th>Nombre del Estudiante</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>${invoice.amount}</td>
                <td>{new Date(invoice.issued_date).toLocaleDateString()}</td>
                <td>{invoice.status}</td>
                <td>{invoice.username}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No se encontraron facturas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SearchInvoices;
