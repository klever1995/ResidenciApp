package main

import (
	"create-service/config"
	"create-service/handlers"
	"fmt"
	"log"
	"net/http"
)

// Middleware para habilitar CORS en todas las solicitudes
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000") // Permitir frontend
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Manejo de preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Log de cada solicitud entrante
		log.Printf("📢 %s %s", r.Method, r.URL.Path)

		next.ServeHTTP(w, r)
	})
}

func main() {
	// Conectar a la base de datos
	config.ConnectDB()

	// Verificar que la conexión esté establecida correctamente
	if db := config.GetDB(); db == nil {
		log.Fatal("❌ Error: No se pudo establecer conexión con la base de datos")
		return
	}

	// Multiplexor de rutas
	mux := http.NewServeMux()
	mux.HandleFunc("/cproperties", handlers.CreatePropertyHandler)

	// Puerto del servidor
	port := "3001"
	fmt.Println("🚀 Servidor ejecutándose en el puerto " + port)

	// Aplicar middleware de CORS a todas las rutas y arrancar el servidor
	log.Fatal(http.ListenAndServe(":"+port, corsMiddleware(mux)))
}
