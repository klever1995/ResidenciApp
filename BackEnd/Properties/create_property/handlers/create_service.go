package handlers

import (
	"create-service/config"
	"create-service/models"
	"encoding/json"
	"fmt"
	"net/http"
)

func CreatePropertyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		return
	}

	var property models.Property
	err := json.NewDecoder(r.Body).Decode(&property)
	if err != nil {
		http.Error(w, "Error al decodificar JSON", http.StatusBadRequest)
		return
	}

	query := `INSERT INTO Properties (title, address, owner_id, price, description, is_available, image, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
	result, err := config.DB.Exec(query, property.Title, property.Address, property.OwnerID, property.Price, property.Description, property.IsAvailable, property.Image, property.City)

	if err != nil {
		http.Error(w, fmt.Sprintf("Error al insertar en la BD: %v", err), http.StatusInternalServerError)
		return
	}

	insertedID, _ := result.LastInsertId()
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":     "Propiedad creada exitosamente",
		"property_id": insertedID,
	})
}
