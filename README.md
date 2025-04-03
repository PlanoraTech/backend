# Setup

## Prerequisites

Before you begin, ensure that you have the following software installed:

- **Node.js** (version 22 or higher): Ensure that Node.js and npm are installed on your machine. You can download them [here](https://nodejs.org/).
- **PostgreSQL** (version 17 or higher): Ensure that PostgreSQL is installed on your machine. You can download it [here](https://www.postgresql.org/)

## Steps to Run the App

### 1. Install Node.js and PostgreSQL
Make sure you have one of the required versions of Node.js and PostgreSQL installed. Everything should work with the default settings.

### 2. (Optional) Create a User in pgAdmin

This step is optional, but if you choose to follow the example `.env` file configuration, you can create a user in pgAdmin with the following details:

- **Username**: `planora`
- **Password**: `planora`

> **Note**: This is not a required step, but it matches the configuration provided in the example `.env` file.

### 3. Install Project Dependencies

Run the following command to install the package dependencies:

```bash
npm i
```

### 4. Create the Database from Prisma Schema
Use Prisma to create the database by running:
```
npx prisma db push
```

### 5. Run the Seeder to Fill the Database with Data
To populate the database with data, run the seeder:
```
npm run seed
```

### 6. Run the Backend in Development Mode
Finally, to start the backend in development mode, use the following command:
```
npm run start:dev
```
