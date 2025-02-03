from database import get_connection

def create_invoice(invoice_data):
    """
    Inserta una nueva factura en la base de datos.
    invoice_data: diccionario con las claves:
      - user_id: ID del usuario (de UserService)
      - reservation_id: ID de la reservación (de ReservationService)
      - amount: Monto de la factura
      - status: Estado de la factura (opcional, por defecto 'unpaid')
    """
    # Si no se provee el estado, usamos 'unpaid'
    status = invoice_data.get("status", "unpaid")

    # La consulta SQL para insertar la factura
    query = """
    INSERT INTO Invoices (user_id, reservation_id, amount, status)
    VALUES (%s, %s, %s, %s)
    """
    values = (
        invoice_data["user_id"],
        invoice_data["reservation_id"],
        invoice_data["amount"],
        status
    )

    conn = get_connection()
    cursor = conn.cursor()
    try: 
        cursor.execute(query, values)
        conn.commit()
        invoice_id = cursor.lastrowid
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()


    return invoice_id