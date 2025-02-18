package main

import (
	"delete-service/config"
	"delete-service/handlers"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	// Conexión a la base de datos
	config.ConnectDB()

	// Crear un router con mux
	r := mux.NewRouter()

	// Definir el endpoint para eliminar propiedad
	r.HandleFunc("/dproperty/{id}", handlers.DeletePropertyHandler).Methods("DELETE")

	// Configuración de CORS (permitir solicitudes desde localhost:3000)
	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"}, // Permitir solicitudes desde el frontend en localhost:3000
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})

	// Iniciar el servidor con CORS habilitado
	port := "3004"
	fmt.Println("🚀 Servidor ejecutándose en el puerto " + port)
	log.Fatal(http.ListenAndServe(":"+port, corsHandler.Handler(r)))
}
