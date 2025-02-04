from database import get_connection


def get_all_invoices():
    """
    Obtiene todas las facturas almacenadas en la base de datos.
    """
    query = "SELECT id, student_id, reservation_id, amount, status FROM Invoices"
    
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)  # Devuelve los resultados como diccionarios
    try:
        cursor.execute(query)
        invoices = cursor.fetchall()  # Obtener todas las filas
    finally:
        cursor.close()
        conn.close()

    return invoices

def get_invoice_by_id(invoice_id):
    """
    Obtiene una factura específica por su ID.
    """
    query = "SELECT id, student_id, reservation_id, amount, status FROM Invoices WHERE id = %s"
    
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(query, (invoice_id,))
        invoice = cursor.fetchone()  # Obtener solo una fila
    finally:
        cursor.close()
        conn.close()

    return invoice