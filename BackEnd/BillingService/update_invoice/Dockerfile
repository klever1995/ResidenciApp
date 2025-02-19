# Usar una imagen base de Python 3.10
FROM python:3.10-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el archivo de requisitos e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del microservicio
COPY . .

# Exponer el puerto en el que corre el microservicio
EXPOSE 5003

# Comando para ejecutar el microservicio
CMD ["python", "app.py"]