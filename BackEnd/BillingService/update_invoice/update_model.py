from database import get_connection

def update_invoice(invoice_id, invoice_data):
    """
    Actualiza una factura existente en la base de datos.
    invoice_id: ID de la factura a actualizar.
    invoice_data: diccionario con los campos a actualizar:
      - student_id (opcional)
      - reservation_id (opcional)
      - amount (opcional)
      - status (opcional)
    """
    fields = []
    values = []

    # Construimos dinámicamente la consulta SQL con los campos que se enviaron
    if "student_id" in invoice_data:
        fields.append("student_id = %s")
        values.append(invoice_data["student_id"])
    
    if "reservation_id" in invoice_data:
        fields.append("reservation_id = %s")
        values.append(invoice_data["reservation_id"])
    
    if "amount" in invoice_data:
        fields.append("amount = %s")
        values.append(invoice_data["amount"])
    
    if "status" in invoice_data:
        fields.append("status = %s")
        values.append(invoice_data["status"])

    # Si no hay campos para actualizar, salimos
    if not fields:
        return {"message": "No se proporcionaron datos para actualizar"}

    # Construimos la consulta SQL de actualización
    query = f"UPDATE Invoices SET {', '.join(fields)} WHERE id = %s"
    values.append(invoice_id)  # Agregamos el ID al final

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query, tuple(values))
        conn.commit()
        if cursor.rowcount == 0:
            return {"message": "Factura no encontrada o sin cambios"}
        return {"message": "Factura actualizada correctamente"}
    except Exception as e:
        conn.rollback()
        return {"error": f"Error al actualizar la factura: {e}"}
    finally:
        cursor.close()
        conn.close()
