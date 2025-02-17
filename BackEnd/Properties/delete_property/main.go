package main

import (
	"delete-service/config"
	"delete-service/handlers"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	config.ConnectDB()

	r := mux.NewRouter()
	r.HandleFunc("/dproperty/{id}", handlers.DeletePropertyHandler).Methods("DELETE")

	port := "3004"
	fmt.Println("🚀 Servidor ejecutándose en el puerto " + port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
