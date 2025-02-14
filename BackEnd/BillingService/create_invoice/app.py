from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)

# Habilitar CORS globalmente
CORS(app, supports_credentials=True)

# 🔹 Configuración de conexión a MySQL
db_config = {
    "host": "localhost",
    "user": "root",  # Cambia esto si usas otro usuario
    "password": 'admin123',  # Coloca tu contraseña correcta
    "database": "BillingServices"
}

def get_db_connection():
    """ Crea y devuelve una conexión a MySQL """
    return mysql.connector.connect(**db_config)

# 🔹 Mapeo de estados válidos para MySQL
status_mapping = {
    "Pendiente": "unpaid",
    "Pagado": "paid",
    "Cancelado": "cancelled"
}

@app.route("/invoice", methods=["POST", "OPTIONS"])
def create_invoice():
    if request.method == "OPTIONS":
        # Responder a la solicitud preflight con los encabezados adecuados
        response = jsonify({"message": "CORS preflight passed"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        response.headers.add("Access-Control-Max-Age", "3600")
        return response, 200

    try:
        # 📌 Obtener datos de la solicitud
        data = request.json
        student_id = data.get("student_id")
        reservation_id = data.get("reservation_id")
        amount = data.get("amount")
        status = data.get("status", "Pendiente")

        # 📌 Validar que no falten datos
        if not all([student_id, reservation_id, amount]):
            return jsonify({"error": "Faltan datos obligatorios"}), 400
        
        # 📌 Convertir el status a un valor permitido en la base de datos
        if status in status_mapping:
            status = status_mapping[status]
        else:
            return jsonify({"error": "Estado no válido"}), 400

        # 📌 Conectar a la base de datos
        conn = get_db_connection()
        cursor = conn.cursor()

        # 📌 Insertar datos en la tabla `Invoices`
        query = """
        INSERT INTO Invoices (student_id, reservation_id, amount, status) 
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (student_id, reservation_id, amount, status))
        conn.commit()

        # 📌 Obtener el ID de la nueva factura
        invoice_id = cursor.lastrowid

        # 📌 Cerrar la conexión
        cursor.close()
        conn.close()

        return jsonify({
            "message": "Factura creada exitosamente",
            "invoice_id": invoice_id,
            "data": data
        }), 201

    except mysql.connector.Error as err:
        print("❌ Error en MySQL:", err)
        return jsonify({"error": f"Error en MySQL: {err}"}), 500

    except Exception as e:
        print("❌ Error desconocido:", e)
        return jsonify({"error": f"Error en el servidor: {e}"}), 500

    finally:
        # 📌 Asegurar que la conexión se cierre en caso de error
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
