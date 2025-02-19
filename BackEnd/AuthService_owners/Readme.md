# AuthService Owner

This project is a microservice designed to manage owner authentication operations using Token. The microservice is built in JavaScript (Node.js) and follows a clean architecture to ensure modularity and scalability.

## Overview

The `AuthService` folder contains the microservice dedicated to:

1. **Authenticate Owner**: Manages owner login and token generation.

## Architecture

The microservice is designed with a layered architecture, separating concerns into different components:

- **Routes (Endpoints)**: Handle incoming HTTP requests and manage the flow of data.
- **Models**: Define the data structures and interact with the database.
- **Controllers**: Contain business logic for authentication operations.
- **Middleware**: Includes authentication and validation logic.
- **Config**: Manages configuration settings, including environment variables.
- **Server.js**: The entry point for the microservice, initializing and running the application.

## Language and Tools

- **JavaScript (Node.js & Express.js)**: The primary programming language and framework used for building the microservice.
- **JWT (JSON Web Tokens)**: Used for authentication and authorization.
- **Docker**: The microservice can be containerized using Docker for easy deployment.
- **MySQL**: The database used to store owner authentication data, configured via environment variables.

## Environment Variables

The microservice relies on the following environment variables, which are defined in the `.env` file:

- `DB_HOST=database-auth.cge22i1wn4cz.us-east-1.rds.amazonaws.com`
- `DB_USER=admin`
- `DB_PASSWORD=YourSecurePassword`
- `DB_PORT=3306`
- `DB_NAME=AuthService`
- `JWT_SECRET=YourJWTSecretKey`

## Getting Started

To run the microservice, follow these steps:

1. **Set up the environment**: Ensure the `.env` file is correctly configured with your database credentials and JWT secret.
2. **Install dependencies**: Navigate to the microservice folder and run the following command:

   ```bash
   npm install
   ```

3. **Run the microservice**: Use the following command to start the microservice:

   ```bash
   node AuthService_owner/app.js
   ```

