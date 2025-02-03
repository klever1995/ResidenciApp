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

# Crear un pool de conexiones para poder reutilizar las conexiones
connection_pool = pooling.MySQLConnectionPool(
    pool_name="bulling_pool",
    pool_size=5,
    **dbconfig
)

def get_connection():
    """Obtiene una conexión del pool. """
    return connection_pool.get_connection()

