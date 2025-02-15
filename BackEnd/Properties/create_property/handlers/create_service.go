package handlers

import (
	"create-service/config"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"
)

// Configurar CORS
func enableCORS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000") // Permitir peticiones desde el frontend
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
}

func CreatePropertyHandler(w http.ResponseWriter, r *http.Request) {
	// Habilitar CORS
	enableCORS(w, r)

	if r.Method != http.MethodPost {
		http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		return
	}

	// Parsear el formulario con un límite de tamaño de archivo
	err := r.ParseMultipartForm(10 << 20) // 10MB máximo
	if err != nil {
		http.Error(w, "Error al procesar el formulario", http.StatusBadRequest)
		return
	}

	// Obtener los valores de texto
	title := r.FormValue("title")
	address := r.FormValue("address")
	usernameOwner := r.FormValue("usernameOwner")
	priceStr := r.FormValue("price")
	description := r.FormValue("description")
	city := r.FormValue("city")
	isAvailable := r.FormValue("is_available")

	// Validar campos obligatorios
	if usernameOwner == "" || title == "" || address == "" || priceStr == "" {
		http.Error(w, "Todos los campos son obligatorios", http.StatusBadRequest)
		return
	}

	// Convertir el precio a float
	price, err := strconv.ParseFloat(priceStr, 64)
	if err != nil {
		http.Error(w, "Precio inválido", http.StatusBadRequest)
		return
	}

	// Manejo de imagen
	var imagePath string
	file, handler, err := r.FormFile("image")
	if err == nil { // Si se subió una imagen
		defer file.Close()

		// Asegurar que la carpeta uploads/ existe
		uploadDir := "uploads"
		if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
			err = os.Mkdir(uploadDir, os.ModePerm)
			if err != nil {
				http.Error(w, "Error al crear la carpeta de imágenes", http.StatusInternalServerError)
				return
			}
		}

		// Sanitizar el nombre de la imagen
		imageFileName := fmt.Sprintf("%d_%s", time.Now().Unix(), handler.Filename)
		imagePath = filepath.Join(uploadDir, imageFileName)

		// Guardar la imagen
		dst, err := os.Create(imagePath)
		if err != nil {
			http.Error(w, "Error al guardar la imagen", http.StatusInternalServerError)
			return
		}
		defer dst.Close()

		_, err = io.Copy(dst, file)
		if err != nil {
			http.Error(w, "Error al copiar la imagen", http.StatusInternalServerError)
			return
		}
	}

	// Conectar con la base de datos
	db := config.GetDB()
	if db == nil {
		http.Error(w, "Error en la conexión a la base de datos", http.StatusInternalServerError)
		return
	}

	// Insertar en la base de datos
	query := `INSERT INTO Properties (title, address, usernameOwner, price, description, is_available, image, city) 
	          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
	result, err := db.Exec(query, title, address, usernameOwner, price, description, isAvailable, imagePath, city)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error al insertar en la BD: %v", err), http.StatusInternalServerError)
		return
	}

	// Obtener el ID insertado
	insertedID, _ := result.LastInsertId()

	// Responder con éxito
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":     "Propiedad creada exitosamente",
		"property_id": insertedID,
		"image_path":  imagePath, // Enviar la ruta de la imagen guardada
	})
}
