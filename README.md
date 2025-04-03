# Setup
## Requirements
NodeJS 22 || 23
PostgreSQL

## Steps
### Install NodeJS (one of the version listed above) and PostgreSQL
Everything will work with the default settings

### Create a user in pgAdmin called planora with the password planora (Optional)
This is not a required step, but this is how the example .env file is configured

### Install package dependencies of the project with npm
```
npm i
```

### Create the database from Prisma schema
```
npx prisma db push
```

### Run the seeder to fill up the database with data
```
npm run seed
```

### Lastly, run the backend in dev mode
```
npm run start:dev
```
