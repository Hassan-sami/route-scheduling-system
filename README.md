# Route Scheduling System API Task🚚

## Technology Stack 🛠️

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Security**: Helmet, CORS
- **Validation**: Custom middleware validation

## Prerequisites 📋

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm**

## Setup Instructions 🚀

1.  **Database Setup**

    -   Create a PostgreSQL database:

        ``` bash
        psql -U postgres
        CREATE DATABASE route_scheduling;
        ```

2.  **Environment Configuration**

    -   Create a `.env` file in the root directory and add your database
        credentials:

        ``` env
        DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@localhost:5432/route_scheduling?schema=public"
        PORT=3000
        ```

    -   ⚠️ Replace `YOUR_DB_PASSWORD` with your actual PostgreSQL
        password.

3.  **Installation & Setup**

    ``` bash
    npm install
    npm run db:push        # Push schema to the database
    npx prisma generate    # Create Prisma Client
    npm run db:seed        # (Optional) Seed with sample data
    npm run dev            # Start development server
    ```

------------------------------------------------------------------------

## Assumptions Made 🤔

-   **Driver Availability**: Drivers are created as available by
    default.\
-   **Automatic Assignment**: The system assigns the first available
    driver (FIFO).\
-   **Single Assignment**: Each driver can only handle one active route
    at a time.\
-   **Route Status Flow**: `pending → assigned/unassigned → completed`.\
-   **Assignment Priority**: Available drivers are prioritized over busy
    ones.

------------------------------------------------------------------------

## Features Implemented ✨

-   **Driver Management**
    -   Create drivers with license types & availability.\
    -   Retrieve drivers with pagination.\
    -   View driver details & assignments.
-   **Route Management**
    -   Create routes with distance & estimated time.\
    -   Automatic driver assignment upon route creation.\
    -   Paginated route listings.
-   **Scheduling System**
    -   Real-time driver-route assignment.\
    -   Automatic & manual assignment.\
    -   Route completion & driver availability updates.

------------------------------------------------------------------------

✅ Follow these steps and the system will be ready to run on
`http://localhost:3000`.
