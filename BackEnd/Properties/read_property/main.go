package main

import (
	"fmt"
	"log"
	"net/http"
	"read-service/config"
	"read-service/handlers"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/rs/cors"
)

// WebSocket Configuration
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Permitir conexiones desde cualquier origen
	},
}

var (
	clients   = make(map[*websocket.Conn]bool)
	broadcast = make(chan []byte)
	mu        sync.Mutex // Para evitar problemas de concurrencia
)

// WebSocket handler
func handleConnections(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("❌ Error al actualizar a WebSocket:", err)
		return
	}
	defer func() {
		mu.Lock()
		delete(clients, conn)
		mu.Unlock()
		conn.Close()
		log.Println("🔌 Cliente desconectado")
	}()

	mu.Lock()
	clients[conn] = true
	mu.Unlock()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("⚠️ Error al leer mensaje:", err)
			break
		}
		broadcast <- message
	}
}

// Manejo de mensajes WebSocket
func handleMessages() {
	for {
		msg := <-broadcast
		mu.Lock()
		for client := range clients {
			err := client.WriteMessage(websocket.TextMessage, msg)
			if err != nil {
				log.Println("⚠️ Error al enviar mensaje:", err)
				client.Close()
				delete(clients, client)
			}
		}
		mu.Unlock()
	}
}

func main() {
	// Conectar a la base de datos
	config.ConnectDB()

	// Crear servidor HTTP
	mux := http.NewServeMux()

	// Rutas HTTP
	mux.HandleFunc("/rproperties", handlers.GetAllPropertiesHandler)

	// Rutas WebSocket
	mux.HandleFunc("/ws", handleConnections)

	// Configuración de CORS
	handler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // Permitir el frontend
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	}).Handler(mux)

	// Iniciar goroutine para manejar mensajes WebSocket
	go handleMessages()

	// Iniciar servidor HTTP
	port := "3002"
	fmt.Println("\U0001F680 Servidor ejecutándose en el puerto " + port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
