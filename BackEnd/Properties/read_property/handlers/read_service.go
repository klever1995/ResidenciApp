package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"read-service/config"
	"read-service/models"
	"strconv"
)

func GetAllPropertiesHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := config.DB.Query("SELECT id, title, address, owner_id, price, description, is_available, image, city, created_at, updated_at FROM Properties")
	if err != nil {
		http.Error(w, fmt.Sprintf("Error al obtener propiedades: %v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var properties []models.Property
	for rows.Next() {
		var property models.Property
		err := rows.Scan(&property.ID, &property.Title, &property.Address, &property.OwnerID, &property.Price, &property.Description, &property.IsAvailable, &property.Image, &property.City, &property.CreatedAt, &property.UpdatedAt)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error al escanear la propiedad: %v", err), http.StatusInternalServerError)
			return
		}
		properties = append(properties, property)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(properties)
}

func GetPropertyByIDHandler(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var property models.Property
	err = config.DB.QueryRow("SELECT id, title, address, owner_id, price, description, is_available, image, city, created_at, updated_at FROM Properties WHERE id = ?", id).
		Scan(&property.ID, &property.Title, &property.Address, &property.OwnerID, &property.Price, &property.Description, &property.IsAvailable, &property.Image, &property.City, &property.CreatedAt, &property.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Propiedad no encontrada", http.StatusNotFound)
		} else {
			http.Error(w, fmt.Sprintf("Error al obtener la propiedad: %v", err), http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(property)
}
