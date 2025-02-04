from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from update_model import update_invoice  # Importa la función de actualización desde update_model

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)

# ✅ Endpoint para actualizar una factura
@app.route("/invoice/<int:invoice_id>", methods=["PUT"])
def update_invoice_status(invoice_id):  # Cambio de nombre para evitar conflicto con la función importada
    data = request.get_json()

    # Validación de los datos recibidos
    if not data or "status" not in data:
        return jsonify({"error": "El campo 'status' es obligatorio"}), 400

    try:
        result = update_invoice(invoice_id, data["status"])  # Llamada a la función de actualización

        if result:
            return jsonify({"message": "Factura actualizada correctamente"}), 200
        else:
            return jsonify({"message": "Factura no encontrada o sin cambios"}), 404

    except Exception as e:
        return jsonify({"error": f"Error al actualizar la factura: {str(e)}"}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5003))
    app.run(host="0.0.0.0", port=port, debug=True)
