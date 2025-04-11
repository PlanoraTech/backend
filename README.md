![Image](https://private-user-images.githubusercontent.com/146822610/432903686-429968dc-036d-46be-ace2-c39ba5023bf2.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDQzOTkwMzYsIm5iZiI6MTc0NDM5ODczNiwicGF0aCI6Ii8xNDY4MjI2MTAvNDMyOTAzNjg2LTQyOTk2OGRjLTAzNmQtNDZiZS1hY2UyLWMzOWJhNTAyM2JmMi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwNDExJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDQxMVQxOTEyMTZaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1kN2Q4MDk3MDEwOTY1YjM5ZThmOGNlOTRkM2FkODg0NmU3MGRhZWFhOGY0ZTdhNTE4MjdjYzlkNmY3ZjA2OWZhJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.LKryIFQ2aktG9ytV6uhzbX0nDmOO_8EKdWgLLoCOxZA)
# Planora
This repository contains the core framework of **Planora**, a comprehensive all-in-one institution management system.

## Setup

### Prerequisites

Before you begin, ensure that you have the following software installed:

- **Node.js** (version 22 or higher): Ensure that Node.js and npm are installed on your machine. You can download them [here](https://nodejs.org/).
- **PostgreSQL** (version 17 or higher): Ensure that PostgreSQL is installed on your machine. You can download it [here](https://www.postgresql.org/)

### Steps to Run the App

#### 1. Clone the Repository
Clone the project repository to your local machine:
```bash
git clone <repository-url>
cd <project-directory>
```

#### 2. (Optional) Create a User in pgAdmin

This step is optional, but if you choose to follow the example `.env` file configuration, you can create a user in pgAdmin with the following details:

- **Username**: `planora`
- **Password**: `planora`

> **Note**: This is not a required step, but it matches the configuration provided in the example `.env` file.

#### 3. Install Project Dependencies

Run the following command to install the package dependencies:

```bash
npm i
```

#### 4. Create the Database from Prisma Schema
Use Prisma to create the database by running:
```bash
npx prisma db push
```

#### 5. Run the Seeder to Fill the Database with Data
To populate the database with data, run the seeder:
```bash
npm run seed
```

#### 6. Run the Backend in Development Mode
Finally, to start the backend in development mode, use the following command:
```bash
npm run start:dev
```

## API documentation
Swagger API documentation is available at: `<backend-url>/api`

> Replace `<backend-url>` with the actual backend URL (e.g., `http://localhost:3000/api`)

## Default Accounts

The seeder generates the following accounts by default:

| Name                            | Role         | Email Address                | Password         |
|---------------------------------|--------------|------------------------------|------------------|
|             **-**               | USER         | diak@petrik.hu               | diak             |
| **Merényi Miklós**              | PRESENTATOR  | merenyi.miklos@petrik.hu     | merenyimiklos    |
| **Jabelkó-Tolnai Csilla Anna**  | PRESENTATOR  | tolnai@petrik.hu             | tolnaicsilla     |
| **Gál-Berey Csilla**            | DIRECTOR     | galberey@petrik.hu           | galbereycsilla   |


## Unit tests
To test whether the app passes every automatic unit test, use the following command:
```bash
npm run test
```
