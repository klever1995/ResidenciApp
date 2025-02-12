package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

// GetConnection devuelve una conexión a la base de datos
func GetConnection() (*sql.DB, error) {
	// Leer variables de entorno
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	// Construir la URL de conexión
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		dbUser, dbPassword, dbHost, dbPort, dbName)

	// Abrir conexión con la base de datos
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Error conectando a la base de datos: %v", err)
		return nil, err
	}

	// Verificar la conexión
	err = db.Ping()
	if err != nil {
		log.Fatalf("No se pudo conectar a la base de datos: %v", err)
		return nil, err
	}

	fmt.Println("Conectado a la base de datos MySQL")
	return db, nil
}
