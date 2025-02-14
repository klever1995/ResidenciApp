package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"sync"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var (
	db   *sql.DB
	once sync.Once // Para asegurar que solo se inicialice una vez
)

// ConnectDB inicializa la conexión a la base de datos
func ConnectDB() {
	once.Do(func() { // Garantiza que solo se ejecute una vez
		// Cargar las variables de entorno desde .env
		err := godotenv.Load()
		if err != nil {
			log.Println("⚠️ No se pudo cargar el archivo .env, usando variables del sistema.")
		}

		// Obtener credenciales de MySQL desde .env
		dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_HOST"),
			os.Getenv("DB_PORT"),
			os.Getenv("DB_NAME"),
		)

		// Conectar a MySQL
		db, err = sql.Open("mysql", dsn)
		if err != nil {
			log.Fatalf("❌ Error al conectar a la base de datos: %v", err)
		}

		// Verificar la conexión
		err = db.Ping()
		if err != nil {
			log.Fatalf("❌ No se pudo conectar a la base de datos: %v", err)
		}

		fmt.Println("✅ Conexión a la base de datos establecida")
	})
}

// GetDB retorna la instancia de la base de datos
func GetDB() *sql.DB {
	if db == nil {
		log.Fatal("❌ Error: La base de datos no ha sido inicializada. Llama a ConnectDB() primero.")
	}
	return db
}
