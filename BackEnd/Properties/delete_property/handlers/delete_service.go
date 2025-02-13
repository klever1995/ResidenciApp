package handlers

import (
	"delete-service/config"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func DeletePropertyHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	query := "DELETE FROM Properties WHERE id=?"
	result, err := config.DB.Exec(query, id)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error al eliminar la propiedad: %v", err), http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "No se encontró la propiedad", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("✅ Propiedad eliminada exitosamente"))
}
