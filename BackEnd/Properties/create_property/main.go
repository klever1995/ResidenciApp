package main

import (
	"create-service/config"
	"create-service/handlers"
	"fmt"
	"log"
	"net/http"
)

func main() {
	config.ConnectDB()

	http.HandleFunc("/cproperties", handlers.CreatePropertyHandler)

	port := "3001"
	fmt.Println("🚀 Servidor ejecutándose en el puerto " + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
