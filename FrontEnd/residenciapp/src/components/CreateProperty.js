import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate
import Navbar3 from "./navbar3";

const CreateProperty = () => {
  const [property, setProperty] = useState({
    title: '',
    address: '',
    price: '',
    description: '',
    is_available: 'disponible',
    city: '',
    usernameOwner: '',
    image: null
  });

  const navigate = useNavigate();  // Inicializa useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty({
      ...property,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setProperty({
      ...property,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', property.title);
    formData.append('address', property.address);
    formData.append('price', property.price);
    formData.append('description', property.description);
    formData.append('is_available', property.is_available);
    formData.append('city', property.city);
    formData.append('usernameOwner', property.usernameOwner);
    if (property.image) {
      formData.append('image', property.image);
    }

    try {
      const response = await axios.post('http://localhost:3001/cproperties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log(response.data);
      
      // Redirige a otra página después de crear la propiedad con éxito
      
      navigate('/principalOwners'); // Cambia '/some-other-page' a la URL a la que quieres redirigir
    } catch (err) {
      console.error('Error al crear la propiedad:', err);
    }
  };

  return (
    <div className="container mt-5">
        <div className="position-absolute top-0 w-100">
        <Navbar3 />
      </div><br></br><br></br>
      <h2 className="text-center mb-4">Crear Propiedad</h2>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={property.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            name="address"
            className="form-control"
            value={property.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={property.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            name="description"
            className="form-control"
            value={property.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Estado</label>
          <select
            name="is_available"
            className="form-select"
            value={property.is_available}
            onChange={handleChange}
            required
          >
            <option value="disponible">Disponible</option>
            <option value="no disponible">No Disponible</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Ciudad</label>
          <input
            type="text"
            name="city"
            className="form-control"
            value={property.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nombre del Propietario</label>
          <input
            type="text"
            name="usernameOwner"
            className="form-control"
            value={property.usernameOwner}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Imagen</label>
          <input
            type="file"
            name="image"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-success btn-lg mt-3">
            Crear Propiedad
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProperty;

