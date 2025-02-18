# AuthServices Students

This project is a collection of microservices designed to manage student authentication operations using Token. Each microservice is built in JavaScript (Node.js) and follows a clean architecture to ensure modularity and scalability.

## Overview

The `AuthServices` folder contains four microservices, each dedicated to a login:


1. **Authenticate Student**: Manages student login and token generation.


## Architecture

The microservices are designed with a layered architecture, separating concerns into different components:

- **Routes (Endpoints)**: Handle incoming HTTP requests and manage the flow of data.
- **Models**: Define the data structures and interact with the database.
- **Controllers**: Contain business logic for each operation.
- **Middleware**: Includes authentication and validation logic.
- **Config**: Manages configuration settings, including environment variables.
- **Server.js**: The entry point for each microservice, initializing and running the application.

## Language and Tools

- **JavaScript (Node.js & Express.js)**: The primary programming language and framework used for building the microservices.
- **JWT (JSON Web Tokens)**: Used for authentication and authorization.
- **Docker**: Each microservice can be containerized using Docker for easy deployment.
- **MySQL**: The database used to store student authentication data, configured via environment variables.

## Environment Variables

The microservices rely on the following environment variables, which are defined in the `.env` file:

- `DB_HOST=database-auth.cge22i1wn4cz.us-east-1.rds.amazonaws.com`
- `DB_USER=admin`
- `DB_PASSWORD=YourSecurePassword`
- `DB_PORT=3306`
- `DB_NAME=AuthServices`
- `JWT_SECRET=YourJWTSecretKey`

## Getting Started

To run the microservices, follow these steps:

1. **Set up the environment**: Ensure the `.env` file is correctly configured with your database credentials and JWT secret.
2. **Install dependencies**: Navigate to each microservice folder and run the following command:

   ```bash
   npm install
   ```

3. **Run the microservices**: Use the following commands to start each microservice:

   ```bash
   node AuthService_student/app.js
   ```

