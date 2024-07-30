# Book Store Web Application

Book Store is a web application built using NestJS for the backend, React for the frontend, PostgreSQL for the database, and Docker for containerization. This project provides a comprehensive solution for managing a collection of books and handling orders. It includes features for adding, editing, and deleting books and orders, as well as viewing detailed information about each book and order.

## Installation

### Prerequisites

Make sure you have the following installed on your machine:
- Docker
- Node
- dotenv-cli (global)

### Steps

1. **Clone the repository:**

    ```bash
    git clone https://github.com/kashi93/book-store.git
    cd book-store
    ```

2. **Create a `.env` file:**

    Create a `.env.development` file in the root back-end directory and add the necessary environment variables.

    ```dotenv
    DATABASE_URL="postgresql://postgres:postgres@localhost:3001/book-store?schema=public"
    ```

3. **Build and run the Docker containers:**

    ```bash
    docker-compose up --build
    
    OR
    
    npm run dev
    ```

    This command will build the Docker images and start the containers for the backend, frontend, and PostgreSQL database.

4. **Generate Prisma Client:**

    Open a new terminal, change the directory to `back-end`, and generate the Prisma client by running:

    ```bash
    dotenv -e .env.development -- npx prisma generate
    dotenv -e .env.development -- npx prisma db push
    ```

5. **Seed Database:**

    Open a new terminal, change the directory to `back-end`, and run the following command. Note that the orders data is not static as it uses the faker package:

    ```bash
    npm run seed
    ```

6. **Access the application:**

    - The React frontend will be available at `http://localhost:5173`
    - The NestJS backend will be running at `http://localhost:3000`
    - The PostgreSQL database will be accessible at `localhost:3001`

### Running in detached mode

```bash
docker-compose up -d --build
```
### Stopping the application

To stop the application, run:

```bash
docker-compose down
```

### Backend Unit Test
Some tests may fail due to the dynamic nature of the Faker seeder:
```bash
npm run test
```

## User Roles

| Action       | Role        |
| ------------ | ----------- |
| CRUD book    | Admin       |
| Create Order | Admin/Guest |
| Read Order   | Admin/Guest |
| Update Order | Admin       |
| Delete Order | Admin       |

### Switch role

#### Frontend

To switch roles on the frontend, use the role selection option available in the navigation bar.

#### API Request

```text
import axios from "axios";

const bookId = 1;

axios.delete(`${BASE_URL}/book/${bookId}`, {
    headers: {
        Role: "Admin"
    }
});
```

## API Endpoints

The following is a list of available API endpoints for the Book Store application. These endpoints allow you to interact with the backend services to manage books, customers, and orders. Each endpoint is associated with specific HTTP methods and roles that determine who can access or modify the data.


| Endpoint               | Method | Description                               | Role  |
| ---------------------- | ------ | ----------------------------------------- | ----- |
| `/book`                | POST   | Create a new book                         | Admin |
| `/book`                | GET    | Retrieve a list of books with pagination  | -     |
| `/book/random-isbn`    | GET    | Generate a random ISBN and unique         | Admin |
| `/book/get-authors`    | GET    | Retrieve a list of unique authors         | Admin |
| `/book/get-categories` | GET    | Retrieve a list of unique categories      | Admin |
| `/book/{id}`           | GET    | Retrieve details of a specific book       | -     |
| `/book`                | PATCH  | Update details of a specific book         | Admin |
| `/book/{id}`           | DELETE | Delete a specific book                    | Admin |
| `/customer`            | GET    | Retrieve a list of all customers          | -     |
| `/order`               | POST   | Create a new order                        | -     |
| `/order`               | GET    | Retrieve a list of orders with pagination | -     |
| `/order/{id}`          | GET    | Retrieve details of a specific order      | -     |
| `/order`               | PATCH  | Update details of a specific order        | Admin |
| `/order/{id}`          | DELETE | Delete a specific order                   | Admin |
| `/order/change-status` | POST   | Change the status of a specific order     | Admin |
