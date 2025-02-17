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

// GetAllPropertiesHandler maneja la obtención de propiedades con filtros opcionales por owner_id o usernameOwner
func GetAllPropertiesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	ownerIDStr := r.URL.Query().Get("owner_id")
	usernameOwner := r.URL.Query().Get("username")

	var (
		rows  *sql.Rows
		err   error
		args  []interface{}
		query = "SELECT id, title, address, COALESCE(owner_id, 0), price, description, is_available, image, city, usernameOwner, created_at, updated_at FROM Properties"
	)

	// Construcción dinámica de la consulta según los parámetros recibidos
	if ownerIDStr != "" {
		ownerID, err := strconv.Atoi(ownerIDStr)
		if err != nil {
			http.Error(w, "Owner ID inválido", http.StatusBadRequest)
			return
		}
		query += " WHERE owner_id = ?"
		args = append(args, ownerID)
	} else if usernameOwner != "" {
		query += " WHERE usernameOwner = ?"
		args = append(args, usernameOwner)
	}

	// Ejecución de la consulta
	rows, err = config.DB.Query(query, args...)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error al obtener propiedades: %v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Procesamiento de los resultados
	var properties []models.Property
	for rows.Next() {
		var property models.Property
		err := rows.Scan(
			&property.ID,
			&property.Title,
			&property.Address,
			&property.OwnerID,
			&property.Price,
			&property.Description,
			&property.IsAvailable,
			&property.Image,
			&property.City,
			&property.UsernameOwner,
			&property.CreatedAt,
			&property.UpdatedAt,
		)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error al escanear la propiedad: %v", err), http.StatusInternalServerError)
			return
		}
		properties = append(properties, property)
	}

	// Envío de la respuesta JSON
	if err := json.NewEncoder(w).Encode(properties); err != nil {
		http.Error(w, "Error al codificar la respuesta", http.StatusInternalServerError)
	}
}
