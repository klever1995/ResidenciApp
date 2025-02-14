# Reservation Microservices

This project is a collection of microservices designed to manage reservation operations using CRUD functionalities (Create, Read, Update, Delete). Each microservice is built in JavaScript (Node.js) and follows a clean architecture to ensure modularity and scalability.

## Overview

The `ReservationServices` folder contains four microservices, each dedicated to a specific CRUD operation:

1. **Create Reservation**: Handles the creation of new reservation entries.
2. **Read Reservation**: Retrieves reservation information from the database.
3. **Update Reservation**: Updates existing reservation entries.
4. **Delete Reservation**: Deletes reservation entries from the database.

## Architecture

The microservices are designed with a layered architecture, separating concerns into different components:

- **Routes (Endpoints)**: Handle incoming HTTP requests and manage the flow of data.
- **Models**: Define the data structures and interact with the database.
- **Controllers**: Contain business logic for each operation.
- **Config**: Manages configuration settings, including environment variables.
- **Server.js**: The entry point for each microservice, initializing and running the application.

## Language and Tools

- **JavaScript (Node.js & Express.js)**: The primary programming language and framework used for building the microservices.
- **Docker**: Each microservice can be containerized using Docker for easy deployment.
- **MySQL**: The database used to store reservation information, configured via environment variables.

## Environment Variables

The microservices rely on the following environment variables, which are defined in the `.env` file:

- `DB_HOST=database-reservations.cge22i1wn4cz.us-east-1.rds.amazonaws.com`
- `DB_USER=admin`
- `DB_PASSWORD=YourSecurePassword`
- `DB_PORT=3306`
- `DB_NAME=ReservationServices`

## Getting Started

To run the microservices, follow these steps:

1. **Set up the environment**: Ensure the `.env` file is correctly configured with your database credentials.
2. **Install dependencies**: Navigate to each microservice folder and run the following command:

   ```bash
   npm install
   ```

3. **Run the microservices**: Use the following commands to start each microservice:

   ```bash
   node create_reservation/index.js
   node read_reservation/index.js
   node update_reservation/index.js
   node delete_reservation/index.js
   ```

