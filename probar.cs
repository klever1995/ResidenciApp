using var command = connection.CreateCommand();
command.CommandText = "SELECT * FROM Users";
using var reader = command.ExecuteReader();
while (reader.Read())
{
    Console.WriteLine($"ID: {reader["id"]}, Username: {reader["username"]}, Email: {reader["email"]}");
}
