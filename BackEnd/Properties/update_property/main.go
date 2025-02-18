package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func updatePropertyHandler(w http.ResponseWriter, r *http.Request) {
	// Configurar CORS
	w.Header().Set("Access-Control-Allow-Origin", "*") // Permitir todos los orígenes
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	// Manejar preflight request (CORS)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Simulación de actualización de propiedad
	var property map[string]interface{}
	err := json.NewDecoder(r.Body).Decode(&property)
	if err != nil {
		http.Error(w, "Error al procesar JSON", http.StatusBadRequest)
		return
	}

	fmt.Println("Propiedad actualizada:", property)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Propiedad actualizada correctamente"})
}

func main() {
	http.HandleFunc("/upproperties", updatePropertyHandler)
	fmt.Println("Servidor corriendo en el puerto 3003...")
	http.ListenAndServe(":3003", nil)
}
