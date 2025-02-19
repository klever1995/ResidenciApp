import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

# Cargamos variables de entorno desde el archivo .env
load_dotenv()

# Configuración de la conexión usando las variables de entorno
dbconfig = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME")
}

try:
    # Crear un pool de conexiones
    connection_pool = pooling.MySQLConnectionPool(
        pool_name="billing_pool",
        pool_size=5,
        **dbconfig
    )
    print("✅ Pool de conexiones a la base de datos creado con éxito.")
except mysql.connector.Error as e:
    print(f"❌ Error al crear el pool de conexiones: {e}")
    connection_pool = None  # Evita que el código falle si la conexión no se puede establecer

def get_connection():
    """ Obtiene una conexión del pool. """
    if connection_pool is None:
        print("⚠ No hay pool de conexiones disponible.")
        return None  # Retorna None si no se pudo inicializar el pool

    try:
        conn = connection_pool.get_connection()
        print("🔗 Conexión a la base de datos obtenida.")
        return conn
    except mysql.connector.Error as e:
        print(f"❌ Error al obtener una conexión del pool: {e}")
        return None
