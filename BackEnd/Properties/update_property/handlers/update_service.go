package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"update-service/config"
	"update-service/models"

	"github.com/gorilla/mux"
)

func UpdatePropertyHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var property models.Property
	err = json.NewDecoder(r.Body).Decode(&property)
	if err != nil {
		http.Error(w, "Error al leer el cuerpo de la solicitud", http.StatusBadRequest)
		return
	}

	query := "UPDATE Properties SET title=?, address=?, owner_id=?, price=?, description=?, is_available=?, city=? WHERE id=?"
	_, err = config.DB.Exec(query, property.Title, property.Address, property.OwnerID, property.Price, property.Description, property.IsAvailable, property.City, id)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error al actualizar la propiedad: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("✅ Propiedad actualizada exitosamente"))
}
