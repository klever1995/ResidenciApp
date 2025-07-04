from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from dotenv import load_dotenv
import requests  # Para realizar la llamada al microservicio de pagos
from read_model import get_all_invoices, get_invoice_by_id, update_invoice_status, get_invoices_by_student_name
from decimal import Decimal
import mysql.connector  # Si estás usando el conector oficial de MySQL


# Cargar variables de entorno
load_dotenv()

# Configurar logging para depuración
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
CORS(app)  # Permitir solicitudes desde otros orígenes

def decimal_to_float(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    return obj

# Función para convertir listas o diccionarios que contienen Decimals a floats
def convert_decimal_in_data(data):
    if isinstance(data, dict):
        return {key: convert_decimal_in_data(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_decimal_in_data(item) for item in data]
    else:
        return decimal_to_float(data)

# Endpoint para obtener todas las facturas
@app.route("/invoice", methods=["GET"])
def read_all_invoices():
    try:
        logging.info("📌 Solicitando todas las facturas")
        invoices = get_all_invoices()  # Función que consulta todas las facturas
        invoices = convert_decimal_in_data(invoices)  # Convertir los valores de Decimal a float
        return jsonify(invoices), 200
    except Exception as e:
        logging.error(f"🔥 ERROR en /invoice: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500

# Nuevo endpoint para buscar facturas por nombre de estudiante
@app.route("/invoices/search", methods=["GET"])
def search_invoices_by_student():
    try:
        username = request.args.get("username")  # Obtener el nombre de usuario desde la query string
        
        if not username:
            return jsonify({"error": "Se requiere el nombre de usuario"}), 400
        
        logging.info(f"📌 Solicitando facturas del estudiante con nombre de usuario: {username}")
        
        invoices = get_invoices_by_student_name(username)  # Función que consulta las facturas por nombre de estudiante
        invoices = convert_decimal_in_data(invoices)  # Convertir los valores de Decimal a float
        return jsonify(invoices), 200
    except Exception as e:
        logging.error(f"🔥 ERROR en /invoices/search: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500

@app.route("/invoice/pay/<int:invoice_id>", methods=["POST"])
def pay_invoice(invoice_id):
    try:
        # Obtener los detalles de la factura
        invoice = get_invoice_by_id(invoice_id)
        if not invoice:
            return jsonify({"error": "Factura no encontrada"}), 404

        # Convertir el monto de la factura a float si es necesario
        invoice = convert_decimal_in_data(invoice)  # Convertir los valores de Decimal a float

        # Llamar al microservicio de pagos
        payment_response = requests.post(
            "http://localhost:9002/payments",
            json={
                "invoice_id": invoice_id,
                "amount": invoice["amount"],  # amount ya será un float
            }
        )

        if payment_response.status_code == 200:
            # Si el pago fue exitoso, actualizamos el estado de la factura
            update_invoice_status(invoice_id, "paid")
            return jsonify({"message": "Factura pagada correctamente"}), 200
        else:
            logging.error(f"Error al procesar el pago: {payment_response.status_code} - {payment_response.text}")
            return jsonify({"error": "Error al procesar el pago"}), 400

    except Exception as e:
        logging.error(f"🔥 ERROR en /invoice/pay/{invoice_id}: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500

# Endpoint para actualizar el estado de una factura (en caso de algún cambio manual)
@app.route("/invoice/<int:invoice_id>", methods=["PUT"])
def update_invoice(invoice_id):
    try:
        data = request.json  # Capturar los datos enviados en el cuerpo
        result = update_invoice_status(invoice_id, data)  # Llamada a la base de datos
        if result:
            return jsonify({"message": "Factura actualizada correctamente"}), 200
        else:
            return jsonify({"error": "No se pudo actualizar la factura"}), 400
    except Exception as e:
        logging.error(f"🔥 ERROR en /invoice/{invoice_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5002))
    logging.info(f"🚀 Servidor corriendo en http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
