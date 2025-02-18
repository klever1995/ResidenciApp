from database import get_connection
import logging
from decimal import Decimal
import mysql.connector  # Si estás usando el conector oficial de MySQL



# Función para convertir Decimals a float
def convert_decimal_to_float(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    return obj

# Función genérica para ejecutar consultas SQL
def execute_query(query, params=None, fetchone=False):
    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query, params if params else ())
        if fetchone:
            return cursor.fetchone()  # Si necesitamos un solo registro
        return cursor.fetchall()  # Si necesitamos varios registros
    except Exception as e:
        logging.error(f"Error al ejecutar la consulta: {str(e)}")
        return {"error": f"Error al ejecutar la consulta: {str(e)}"}
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Función para obtener todas las facturas
def get_all_invoices():
    query = """
        SELECT i.id, s.username AS student_name, i.reservation_id, i.amount, i.status
        FROM Invoices i
        JOIN StudentService.Students s ON i.student_id = s.id
    """
    invoices = execute_query(query)
    return [convert_decimal_to_float(invoice) for invoice in invoices]  # Convertir los montos de Decimal a float

# Función para obtener una factura por su ID
def get_invoice_by_id(invoice_id):
    query = """
        SELECT i.id, s.username AS student_name, i.reservation_id, i.amount, i.status
        FROM Invoices i
        JOIN StudentService.Students s ON i.student_id = s.id
        WHERE i.id = %s
    """
    invoice = execute_query(query, (invoice_id,), fetchone=True)
    if invoice:
        return convert_decimal_to_float(invoice)  # Convertir el monto de Decimal a float
    else:
        logging.warning(f"No se encontró la factura con ID {invoice_id}")
        return {"error": "Factura no encontrada"}

def get_invoices_by_student_name(username):
    query = """
        SELECT I.*, S.username
        FROM Invoices I
        JOIN StudentService.Students S ON I.student_id = S.id
        WHERE S.username LIKE %s
    """
    connection = mysql.connector.connect(user='root', password='admin123', host='localhost', database='BillingServices')
    cursor = connection.cursor(dictionary=True)
    cursor.execute(query, ('%' + username + '%',))
    result = cursor.fetchall()
    cursor.close()
    connection.close()
    return result

# Función para obtener las facturas por student_id
def get_invoices_by_student(student_id):
    query = """
        SELECT i.id, s.username AS student_name, i.reservation_id, i.amount, i.status
        FROM Invoices i
        JOIN StudentService.Students s ON i.student_id = s.id
        WHERE i.student_id = %s
    """
    invoices = execute_query(query, (student_id,))
    return [convert_decimal_to_float(invoice) for invoice in invoices]  # Convertir los montos de Decimal a float

# Función para actualizar el estado de una factura
def update_invoice_status(invoice_id, new_status):
    query = """
        UPDATE Invoices
        SET status = %s
        WHERE id = %s
    """
    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(query, (new_status, invoice_id))
        conn.commit()

        # Verificar si se actualizó alguna fila
        if cursor.rowcount > 0:
            logging.info(f"Factura {invoice_id} actualizada con éxito a estado '{new_status}'")
            return {"message": "Factura actualizada con éxito"}
        else:
            logging.warning(f"No se encontró la factura con ID {invoice_id}")
            return {"error": "Factura no encontrada"}

    except Exception as e:
        logging.error(f"Error al actualizar la factura {invoice_id}: {str(e)}")
        return {"error": f"Error al actualizar la factura: {str(e)}"}
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
