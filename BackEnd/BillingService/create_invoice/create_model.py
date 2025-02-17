import pymysql
from database import get_db_connection

def get_student_id_by_name(student_name):
    """Busca el ID del estudiante por su nombre."""
    connection = get_db_connection()
    cursor = connection.cursor()
    
    query = "SELECT id FROM StudentService.Students WHERE username = %s"
    cursor.execute(query, (student_name,))
    result = cursor.fetchone()
    
    cursor.close()
    connection.close()

    if result:
        return result[0]  # Retorna el ID del estudiante
    return None  # Retorna None si no se encuentra
