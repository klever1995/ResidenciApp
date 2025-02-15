from database import get_connection

def invoice_exists(invoice_id):
    """ Verifica si una factura existe en la base de datos. """
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM Invoices WHERE id = %s", (invoice_id,))
        return cursor.fetchone() is not None
    except Exception as e:
        print(f"❌ Error al verificar existencia de factura: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

def update_invoice(invoice_id, invoice_data):
    """
    Actualiza una factura existente en la base de datos.
    """
    if not invoice_exists(invoice_id):
        return {"message": "❌ Factura no encontrada"}

    fields = []
    values = []

    # Definir los campos que se pueden actualizar
    allowed_fields = ["student_id", "reservation_id", "amount", "status"]

    for field in allowed_fields:
        if field in invoice_data:
            fields.append(f"{field} = %s")
            values.append(invoice_data[field])

    if not fields:
        return {"message": "⚠ No se proporcionaron datos para actualizar"}

    query = f"UPDATE Invoices SET {', '.join(fields)} WHERE id = %s"
    values.append(invoice_id)

    conn = get_connection()
    cursor = conn.cursor()
    try:
        print(f"🔄 Ejecutando SQL: {query} con valores {values}")  # Para depuración
        cursor.execute(query, tuple(values))
        conn.commit()

        if cursor.rowcount == 0:
            return {"message": "⚠ No se realizaron cambios en la factura"}
        
        return {"message": "✅ Factura actualizada correctamente"}

    except Exception as e:
        conn.rollback()
        print(f"❌ Error al actualizar la factura: {e}")  # Log para depuración
        return {"error": f"Error al actualizar la factura: {str(e)}"}

    finally:
        cursor.close()
        conn.close()
