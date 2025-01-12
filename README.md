# Setup
## Requirements
PostgreSQL

## Steps
### Install dependencies of the backend itself
```
npm i
```

### Create the database from the schema
```
npx prisma db push
```

### Run the seeder to fill up the database with random data
```
npx prisma db seed
```