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

// GetAllPropertiesHandler maneja la obtención de propiedades con filtros opcionales por owner_id, usernameOwner, price, title y city
func GetAllPropertiesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Obtención de parámetros de la consulta
	ownerIDStr := r.URL.Query().Get("owner_id")
	usernameOwner := r.URL.Query().Get("username")
	title := r.URL.Query().Get("title")
	minPriceStr := r.URL.Query().Get("min_price")
	maxPriceStr := r.URL.Query().Get("max_price")
	city := r.URL.Query().Get("city")

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
		if queryContainsWhere(query) {
			query += " AND usernameOwner = ?"
		} else {
			query += " WHERE usernameOwner = ?"
		}
		args = append(args, usernameOwner)
	}

	// Filtrar por título
	if title != "" {
		if queryContainsWhere(query) {
			query += " AND title LIKE ?"
		} else {
			query += " WHERE title LIKE ?"
		}
		args = append(args, "%"+title+"%")
	}

	// Filtrar por ciudad
	if city != "" {
		if queryContainsWhere(query) {
			query += " AND city LIKE ?"
		} else {
			query += " WHERE city LIKE ?"
		}
		args = append(args, "%"+city+"%")
	}

	// Filtrar por precios
	if minPriceStr != "" {
		minPrice, err := strconv.Atoi(minPriceStr)
		if err != nil {
			http.Error(w, "El valor de min_price debe ser un número", http.StatusBadRequest)
			return
		}
		if queryContainsWhere(query) {
			query += " AND price >= ?"
		} else {
			query += " WHERE price >= ?"
		}
		args = append(args, minPrice)
	}

	if maxPriceStr != "" {
		maxPrice, err := strconv.Atoi(maxPriceStr)
		if err != nil {
			http.Error(w, "El valor de max_price debe ser un número", http.StatusBadRequest)
			return
		}
		if queryContainsWhere(query) {
			query += " AND price <= ?"
		} else {
			query += " WHERE price <= ?"
		}
		args = append(args, maxPrice)
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

// queryContainsWhere verifica si la consulta ya contiene una cláusula WHERE.
func queryContainsWhere(query string) bool {
	return len(query) > 0 && query[len(query)-6:] == " WHERE"
}
