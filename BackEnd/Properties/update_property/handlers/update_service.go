package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"update-service/config"
	"update-service/models"

	"github.com/gorilla/mux"
	"github.com/streadway/amqp"
)

// Middleware para habilitar CORS
func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func UpdatePropertyHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

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

	// Verificar si la propiedad existe y su estado actual
	var currentStatus string
	err = config.DB.QueryRow("SELECT is_available FROM Properties WHERE id=?", id).Scan(&currentStatus)
	if err != nil {
		http.Error(w, "Error al verificar la existencia de la propiedad", http.StatusInternalServerError)
		return
	}

	// Validar cambios en disponibilidad
	if currentStatus == "no disponible" && property.IsAvailable == "disponible" {
		// Aquí podrías verificar si la reservación ha sido cancelada antes de permitir el cambio
		http.Error(w, "No se puede volver a marcar como disponible sin cancelar la reserva", http.StatusBadRequest)
		return
	}

	// Actualizar la propiedad
	query := "UPDATE Properties SET title=?, address=?, owner_id=?, price=?, description=?, is_available=?, city=? WHERE id=?"
	_, err = config.DB.Exec(query, property.Title, property.Address, property.OwnerID, property.Price, property.Description, property.IsAvailable, property.City, id)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error al actualizar la propiedad: %v", err), http.StatusInternalServerError)
		return
	}

	// Enviar mensaje a RabbitMQ solo si la disponibilidad cambió
	if currentStatus != property.IsAvailable {
		err = SendMessageToQueue(property)
		if err != nil {
			http.Error(w, fmt.Sprintf("Propiedad actualizada, pero error al enviar mensaje a RabbitMQ: %v", err), http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("✅ Propiedad actualizada exitosamente"))
}

// Función para enviar mensaje a RabbitMQ
func SendMessageToQueue(property models.Property) error {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Println("❌ Error al conectar con RabbitMQ:", err)
		return err
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Println("❌ Error al abrir un canal en RabbitMQ:", err)
		return err
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"property_updates",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Println("❌ Error al declarar la cola:", err)
		return err
	}

	// Convertir la propiedad a JSON
	body, err := json.Marshal(property)
	if err != nil {
		log.Println("❌ Error al convertir propiedad a JSON:", err)
		return err
	}

	// Publicar el mensaje en la cola
	err = ch.Publish(
		"",
		q.Name,
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)
	if err != nil {
		log.Println("❌ Error al publicar mensaje:", err)
		return err
	}

	log.Println("✅ Mensaje enviado a RabbitMQ:", string(body))
	return nil
}
