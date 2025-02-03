from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from update_model import update_invoice_status

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)

# Endpoint para actualizar el estado de una factura
@app.route("/<int:invoice_id>", methods=["PUT"])
def update_invoice(invoice_id):
    data = request.get_json()  # Extrae el JSON enviado en la solicitud
    # Verifica que el campo 'status' esté presente
    if "status" not in data:
        return jsonify({"error": "Status is required"}), 400
    try:
        update_invoice_status(invoice_id, data["status"])  # Actualiza el estado de la factura
        return jsonify({"message": "Invoice status updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5003))
    app.run(host="0.0.0.0", port=port, debug=True)
