package main

import (
	"fmt"
	"log"
	"net/http"
	"read-service/config"
	"read-service/handlers"
)

func main() {
	config.ConnectDB()

	http.HandleFunc("/rproperties", handlers.GetAllPropertiesHandler)
	http.HandleFunc("/rproperty", handlers.GetPropertyByIDHandler)

	port := "3002"
	fmt.Println("🚀 Servidor ejecutándose en el puerto " + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
