from database import get_connection


def get_all_invoices():
    query = """
        SELECT i.id, s.username AS student_name, i.reservation_id, i.amount, i.status
        FROM Invoices i
        JOIN StudentService.Students s ON i.student_id = s.id
    """
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(query)
        invoices = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()
    return invoices

def get_invoice_by_id(invoice_id):
    query = """
        SELECT i.id, s.username AS student_name, i.reservation_id, i.amount, i.status
        FROM Invoices i
        JOIN StudentService.Students s ON i.student_id = s.id
        WHERE i.id = %s
    """
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(query, (invoice_id,))
        invoice = cursor.fetchone()
    finally:
        cursor.close()
        conn.close()
    return invoice