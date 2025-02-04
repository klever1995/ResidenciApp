from database import get_connection

def delete_invoice(invoice_id):
    """
    Elimina una factura de la base de datos por su ID.
    invoice_id: ID de la factura a eliminar.
    
    Retorna:
      - True si la eliminación fue exitosa.
      - False si la factura no se encontró.
    """
    query = "DELETE FROM Invoices WHERE id = %s"

    conn = get_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(query, (invoice_id,))
        conn.commit()

        # Verificamos si se eliminó alguna fila
        if cursor.rowcount > 0:
            return True
        else:
            return False

    except Exception as e:
        conn.rollback()
        raise e  # Relanza la excepción para que el controlador la maneje
    finally:
        cursor.close()
        conn.close()
