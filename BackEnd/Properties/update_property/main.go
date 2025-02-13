package main

import (
	"fmt"
	"log"
	"net/http"
	"update-service/config"
	"update-service/handlers"

	"github.com/gorilla/mux"
)

func main() {
	config.ConnectDB()

	r := mux.NewRouter()
	r.HandleFunc("/upproperty/{id}", handlers.UpdatePropertyHandler).Methods("PUT")

	port := "3003"
	fmt.Println("🚀 Servidor ejecutándose en el puerto " + port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
