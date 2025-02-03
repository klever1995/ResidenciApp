from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from delete_model import delete_invoice

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)

# Endpoint para eliminar una factura por ID
@app.route("/<int:invoice_id>", methods=["DELETE"])
def delete_invoice_endpoint(invoice_id):
    try:
        delete_invoice(invoice_id)  # Llama a la función para eliminar la factura
        return jsonify({"message": "Invoice deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5004))
    app.run(host="0.0.0.0", port=port, debug=True)
