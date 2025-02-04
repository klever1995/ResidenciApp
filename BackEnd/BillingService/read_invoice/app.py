from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from read_model import get_all_invoices, get_invoice_by_id

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)  # Permitir solicitudes desde otros orígenes

# Endpoint para obtener todas las facturas
@app.route("/invoice", methods=["GET"])
def read_all_invoices():
    try:
        invoices = get_all_invoices()  # Función que consulta todas las facturas
        return jsonify(invoices), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint para obtener una factura por ID
@app.route("/invoice/<int:invoice_id>", methods=["GET"])
def read_invoice(invoice_id):
    try:
        invoice = get_invoice_by_id(invoice_id)  # Consulta una factura específica
        if invoice:
            return jsonify(invoice), 200
        else:
            return jsonify({"error": "Invoice not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5002))
    app.run(host="0.0.0.0", port=port, debug=True)
