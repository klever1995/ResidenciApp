# Properties Microservices

This project is a collection of microservices designed to manage properties using CRUD operations (Create, Read, Update, Delete). Each microservice is built in Go and follows a clean architecture to ensure modularity and scalability.

## Overview

The `Properties` folder contains four microservices, each dedicated to a specific CRUD operation:

1. **Create Property**: Handles the creation of new property entries.
2. **Read Property**: Retrieves property information from the database.
3. **Update Property**: Updates existing property entries.
4. **Delete Property**: Deletes property entries from the database.

## Architecture

The microservices are designed with a layered architecture, separating concerns into different components:

- **Handlers**: Handle incoming HTTP requests and manage the flow of data.
- **Models**: Define the data structures and interact with the database.
- **Config**: Manages configuration settings, including environment variables.
- **Main.go**: The entry point for each microservice, initializing and running the application.

## Language and Tools

- **Go (Golang)**: The primary programming language used for building the microservices.
- **Docker**: Each microservice can be containerized using Docker for easy deployment.
- **MySQL**: The database used to store property information, configured via environment variables.

## Environment Variables

The microservices rely on the following environment variables, which are defined in the `.env` file:

- `DB_HOST=database-users.cge22i1wn4cz.us-east-1.rds.amazonaws.com`
- `DB_USER=admin`
- `DB_PASSWORD=Narusenin123`
- `DB_PORT=3306`
- `DB_NAME=PropertyServices`

## Getting Started

To run the microservices, follow these steps:

1. **Set up the environment**: Ensure the `.env` file is correctly configured with your database credentials.
2. **Run the microservices**: Use the following commands to start each microservice:

   ```bash
   go run create_property/main.go
   go run read_property/main.go
   go run update_property/main.go
   go run delete_property/main.go