from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from dotenv import load_dotenv
from read_model import get_all_invoices, get_invoice_by_id

# Cargar variables de entorno
load_dotenv()

# Configurar logging para depuración
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
CORS(app)  # Permitir solicitudes desde otros orígenes

# Endpoint para obtener todas las facturas
@app.route("/invoice", methods=["GET"])
def read_all_invoices():
    try:
        logging.info("📌 Solicitando todas las facturas")
        invoices = get_all_invoices()  # Función que consulta todas las facturas
        return jsonify(invoices), 200
    except Exception as e:
        logging.error(f"🔥 ERROR en /invoice: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500

# Endpoint para obtener una factura por ID
@app.route("/invoice/<int:invoice_id>", methods=["PUT"])
def update_invoice(invoice_id):
    try:
        data = request.json  # Capturar los datos enviados en el cuerpo
        result = update_invoice_in_db(invoice_id, data)  # Llamada a la base de datos
        if result:
            return jsonify({"message": "Factura actualizada correctamente"}), 200
        else:
            return jsonify({"error": "No se pudo actualizar la factura"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5002))
    logging.info(f"🚀 Servidor corriendo en http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
