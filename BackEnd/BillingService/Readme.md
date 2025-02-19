# Billing Microservices

This project is a collection of microservices designed to manage billing operations using CRUD functionalities (Create, Read, Update, Delete). Each microservice is built in Python and follows a clean architecture to ensure modularity and scalability.

## Overview

The `BillingServices` folder contains four microservices, each dedicated to a specific CRUD operation:

1. **Create Invoice**: Handles the creation of new invoice entries.
2. **Read Invoice**: Retrieves invoice information from the database.
3. **Update Invoice**: Updates existing invoice entries.
4. **Delete Invoice**: Deletes invoice entries from the database.

## Architecture

The microservices are designed with a layered architecture, separating concerns into different components:

- **Routes (Endpoints)**: Handle incoming HTTP requests and manage the flow of data.
- **Models**: Define the data structures and interact with the database.
- **Config**: Manages configuration settings, including environment variables.
- **Main.py**: The entry point for each microservice, initializing and running the application.

## Language and Tools

- **Python (Flask/FastAPI)**: The primary programming language and framework used for building the microservices.
- **Docker**: Each microservice can be containerized using Docker for easy deployment.
- **MySQL**: The database used to store billing information, configured via environment variables.

## Environment Variables

The microservices rely on the following environment variables, which are defined in the `.env` file:

- `DB_HOST=database-users.cge22i1wn4cz.us-east-1.rds.amazonaws.com`
- `DB_USER=admin`
- `DB_PASSWORD=Narusenin123`
- `DB_PORT=3306`
- `DB_NAME=BillingServices`

## Getting Started

To run the microservices, follow these steps:

1. **Set up the environment**: Ensure the `.env` file is correctly configured with your database credentials.
2. **Install dependencies**: Run the following command to install required Python packages:

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the microservices**: Use the following commands to start each microservice:

   ```bash
   python create_invoice/app.py
   python read_invoice/app.py
   python update_invoice/app.py
   python delete_invoice/app.py
   ```