package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux" // Importa mux para el enrutador

	_ "github.com/go-sql-driver/mysql"
	"github.com/rs/cors"
)

const (
	dbUser     = "root"
	dbPassword = "admin123"
	dbName     = "PropertyService"
	dbHost     = "localhost"
)

// Estructura para la actualización de propiedades
type PropertyUpdate struct {
	PropertyID int    `json:"property_id"`
	Status     string `json:"status"`
}

// Función para notificar al servicio de reservaciones
func notifyReservationService(propertyID int) {
	// URL del servicio de reservaciones (ajusta la URL según corresponda)
	url := fmt.Sprintf("http://localhost:4003/reservation/%d", propertyID)
	data := map[string]int{"property_id": propertyID}
	jsonData, _ := json.Marshal(data)

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("❌ Error al notificar al servicio de reservaciones: %v", err)
		return
	}
	defer resp.Body.Close()
	if resp.StatusCode == http.StatusOK {
		log.Println("✅ Reservaciones actualizadas correctamente.")
	} else {
		log.Printf("❌ Error al actualizar reservaciones, respuesta: %v", resp.Status)
	}
}

// Función para notificar al servicio de facturación
func notifyBillingService(propertyID int) {
	// URL del servicio de facturación (ajusta la URL según corresponda)
	url := "http://127.0.0.1:5003/invoices"
	data := map[string]int{"property_id": propertyID}
	jsonData, _ := json.Marshal(data)

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("❌ Error al notificar al servicio de facturación: %v", err)
		return
	}
	defer resp.Body.Close()
	if resp.StatusCode == http.StatusOK {
		log.Println("✅ Facturación actualizada correctamente.")
	} else {
		log.Printf("❌ Error al actualizar facturación, respuesta: %v", resp.Status)
	}
}

func main() {
	// Conectar a la base de datos
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s", dbUser, dbPassword, dbHost, dbName)
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("❌ Error al conectar con la base de datos: %v", err)
	}
	defer db.Close()

	// Crear un enrutador usando mux
	r := mux.NewRouter()

	// Definir el endpoint REST para actualizar propiedades
	r.HandleFunc("/update/{id}", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPut {
			http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
			return
		}

		// Obtener el parámetro 'id' de la URL
		vars := mux.Vars(r)
		propertyID := vars["id"]

		var update PropertyUpdate
		err := json.NewDecoder(r.Body).Decode(&update)
		if err != nil {
			http.Error(w, "Error al leer el JSON", http.StatusBadRequest)
			return
		}

		// Validación de entrada
		if update.Status != "disponible" && update.Status != "no disponible" {
			http.Error(w, "Estado no válido", http.StatusBadRequest)
			return
		}

		// Actualizar la propiedad en la base de datos
		_, err = db.Exec("UPDATE Properties SET is_available = ? WHERE id = ?", update.Status, propertyID)
		if err != nil {
			log.Printf("❌ Error al actualizar la propiedad: %v", err)
			http.Error(w, "Error al actualizar la propiedad", http.StatusInternalServerError)
			return
		}

		// Notificar a los servicios correspondientes
		notifyReservationService(update.PropertyID)
		notifyBillingService(update.PropertyID)

		// Responder con éxito
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("✅ Propiedad actualizada correctamente"))
	}).Methods("PUT")

	// Configurar CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})

	// Aplicar CORS al router
	handler := c.Handler(r)

	// Iniciar el servidor
	log.Println("🚀 Servidor corriendo en http://localhost:3003")
	log.Fatal(http.ListenAndServe(":3003", handler))
}
