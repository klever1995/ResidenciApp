using System;

class Program
{
    static void Main(string[] args)
    {
        // Cadena de conexión para MySQL
        var connectionString = "Server=localhost;Database=UserService;User=root;Password=tu_password;";
        var mysqlFactory = new MySqlConexionFactory(connectionString);

        // Usar la fábrica para crear y abrir una conexión
        using var connection = mysqlFactory.CrearConexion();
        connection.Open();
        Console.WriteLine("Conexión a la base de datos MySQL establecida correctamente.");

        // Aquí puedes agregar lógica adicional, como ejecutar consultas.
    }
}
