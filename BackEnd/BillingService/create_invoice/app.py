from flask import Flask, request, jsonify
from flask_cors import CORS
from create_model import create_invoice
import os
from dotenv import load_dotenv

#Cargamos las variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app) # Permite peticiones desde otros origenes

@app.route("/invoice", methods=["POST"])
def create_invoice_endpoint():
    """
    Endpoint para crear una factura.
    Espera un JSON con:
      - user_id (int)
      - reservation_id (int)
      - amount (decimal)
      - status (opcional, string: 'unpaid', 'paid' o 'cancelled')
    """
    # Extraer los datos del cuerpo de la solicitud
    invoice_data = request.get_json()

    # Validación simple: Verificar que existen los campos obligatorios
    required_fields = ["user_id", "reservation_id", "amount"]
    missing_fields = [field for field in required_fields if field not in invoice_data]

    if missing_fields:
        return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

    try:
        # Llamada al modelo para crear la factura
        invoice_id = create_invoice(invoice_data)
        return jsonify({"message": "Invoice created", "invoice_id": invoice_id}), 201

    except Exception as e:
        # Retornar un error en caso de fallo en la creación
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)
