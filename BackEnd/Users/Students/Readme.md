# Students Microservices

This project is a collection of microservices designed to manage students using CRUD operations (Create, Read, Update, Delete). Each microservice is built in JavaScript (Node.js) and follows a modular architecture to ensure scalability and maintainability.

## Overview

The `Students` folder contains four microservices, each dedicated to a specific CRUD operation:

1. **Create Student**: Handles the creation of new student entries.
2. **Read Student**: Retrieves student information from the database.
3. **Update Student**: Updates existing student entries.
4. **Delete Student**: Deletes student entries from the database.

## Architecture

The microservices are designed with a layered architecture, separating concerns into different components:

- **Handlers**: Handle incoming HTTP requests and manage the flow of data.
- **Database (db.js)**: Manages the connection to the MySQL database and executes queries.
- **Index.js**: The entry point for each microservice, initializing and running the application.
- **Dockerfile**: Configuration for containerizing the microservice using Docker.

## Language and Tools

- **JavaScript (Node.js)**: The primary programming language used for building the microservices.
- **Express.js**: A web framework for Node.js used to handle HTTP requests.
- **Docker**: Each microservice can be containerized using Docker for easy deployment.
- **MySQL**: The database used to store student information, configured via environment variables.

## Environment Variables

The microservices rely on the following environment variables, which are defined in the `.env` file:

- `DB_HOST=database-users.cge22i1wn4cz.us-east-1.rds.amazonaws.com`
- `DB_USER=admin`
- `DB_PASSWORD=Narusenin123`
- `DB_NAME=StudentService`
- `DB_PORT=3306`

## Getting Started

To run the microservices, follow these steps:

1. **Set up the environment**: Ensure the `.env` file is correctly configured with your database credentials.
2. **Install dependencies**: Navigate to each microservice folder and run:

   ```bash
   npm install
   node create_student/index.js
   node read_student/index.js
   node update_student/index.js
   node delete_student/index.js