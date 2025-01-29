import React from 'react';
import './App.css';
import PropertyAdmin from './PropertyAdmin'; // Importa el componente PropertyAdmin

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Bienvenido a la Administración de Propiedades</h1>
        {/* Llamar al componente PropertyAdmin aquí */}
        <PropertyAdmin />
      </header>
    </div>
  );
}

export default App;
