# Financial API

Backend API for managing personal finances, users, authentication, debts, debt installments, and installment payments.

The project is a modular TypeScript API built with Express, Prisma, PostgreSQL, and dependency injection through `tsyringe`. The current domain focus is debt tracking: who owes whom, how a debt is split into installments, and how installment payments are registered.

## Tech Stack

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- `@prisma/adapter-pg`
- `tsyringe` for dependency injection
- `bcryptjs` for password hashing
- `jsonwebtoken` for authentication tokens
- `zod` for validation in existing use cases
- `date-fns` and `dayjs` for date handling
- Node.js test runner
- Docker and Docker Compose
- REST Client `.http` files for manual API testing

## Project Structure

```text
src/
  modules/
    auth/
    debts/
    installments/
    transactions/
    users/
  shared/
    container/
    infra/
      http/
      prisma/

requests/
  auth.http
  debts.http
  installments.http
  users.http

tests/
  helpers/
  modules/
```

## Features

- User creation, listing, update, and authenticated deletion.
- User authentication with JWT returned as `refresh_token`.
- Debt creation with optional installment generation.
- Installment payment registration.
- Partial installment payments.
- Automatic installment status update to `PAID` when the paid amount reaches the base amount.
- Payment transaction registration for installment payments.
- Prisma migrations and seed data for realistic debt scenarios.
- Use case tests for users, authentication, debt creation, and installment payment.
- REST Client request files grouped by module.

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL 15+
- Docker and Docker Compose, optional but recommended for local database setup

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/appdb"
SECRET_TOKEN="local-secret-token"
SECRET_REFRESH_TOKEN="local-secret-refresh-token"
```

Notes:

- `DATABASE_URL` is required by Prisma and the PostgreSQL adapter.
- `SECRET_TOKEN` is used to sign and verify the JWT expected by protected routes.
- `SECRET_REFRESH_TOKEN` is already part of the auth configuration, although the current authentication flow signs the returned token with `SECRET_TOKEN`.
- The HTTP server currently listens on `http://localhost:3000`.

## Running Locally

Install dependencies:

```bash
npm install
```

Start PostgreSQL with Docker:

```bash
docker compose up db -d
```

Generate the Prisma client:

```bash
npx prisma generate
```

Apply database migrations:

```bash
npx prisma migrate deploy
```

Seed the database with sample users, debts, installments, and payments:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

## Running with Docker

Start the API and PostgreSQL:

```bash
docker compose up --build
```

This starts:

- API on `http://localhost:3000`
- PostgreSQL on `localhost:5432`

The Docker app command runs Prisma generation and migration deployment before starting the development server.

## Useful Commands

```bash
npm run dev
npm run seed
npm test
npx prisma generate
npx prisma migrate deploy
npx prisma studio
npx tsc -p tsconfig.json --noEmit
```

## Seed Data

The seed file lives at:

```text
src/shared/infra/prisma/seed.ts
```

It resets users, tokens, debts, installments, and transactions, then creates deterministic records with fixed IDs.

Main debt scenarios:

- `seed-debt-all-paid`: all installments are paid.
- `seed-debt-some-paid`: some installments are paid and others are pending.
- `seed-debt-none-paid`: no installments are paid.
- `seed-debt-partially-paid`: some installments have partial payments.

Seeded users use the password:

```text
123456
```

## Manual API Testing

REST Client files are available in:

```text
requests/
```

Files by module:

- `requests/auth.http`
- `requests/users.http`
- `requests/debts.http`
- `requests/installments.http`

Open one of these files in VS Code with the REST Client extension installed, update the variables at the top of the file, and run the requests directly from the editor.

## API Endpoints

### Authentication

#### `POST /auth/session`

Authenticates a user with email and password.

Request body:

```json
{
  "email": "danilo@example.com",
  "password": "123456"
}
```

Response body:

```json
{
  "refresh_token": "jwt-token",
  "user": {
    "name": "Danilo Lima",
    "email": "danilo@example.com"
  }
}
```

The returned `refresh_token` is the value expected in the `Authorization` header for protected routes:

```http
Authorization: Bearer <refresh_token>
```

### Users

#### `POST /users`

Creates a user.

Request body:

```json
{
  "name": "Danilo Lima",
  "email": "danilo@example.com",
  "password": "123456"
}
```

#### `GET /users`

Lists all users.

Current response status: `201`.

#### `PUT /users/:id`

Updates a user by ID.

Request body:

```json
{
  "name": "Danilo Silva",
  "email": "danilo.silva@example.com"
}
```

#### `DELETE /users/:id`

Deletes a user by ID.

Protected route:

```http
Authorization: Bearer <token>
```

Current response status: `201`.

### Debts

#### `POST /debts`

Creates a debt. When `installments` is provided, the use case creates one installment per requested parcel.

Request body without installments:

```json
{
  "debtorId": "seed-user-bruno",
  "creditorId": "seed-user-ana",
  "totalAmount": 900
}
```

Request body with installments:

```json
{
  "debtorId": "seed-user-bruno",
  "creditorId": "seed-user-ana",
  "totalAmount": 900,
  "installments": 3
}
```

Current response status: `201`.

### Installments

#### `PATCH /installments/:installmentId/pay`

Registers a payment for an installment.

Request body:

```json
{
  "amount": 300,
  "paidAt": "2026-05-04T10:00:00.000Z"
}
```

`paidAt` is optional. If the accumulated `totalPaid` reaches or exceeds the installment `baseAmount`, the installment is marked as `PAID` and receives a payment date.

Current response status: `200`.

### Transactions

The transaction module exists in the domain and persistence layers. Payment transactions are created internally when an installment payment is registered.

There are no public transaction HTTP routes yet.

## Tests

Run the test suite:

```bash
npm test
```

The current tests compile the test TypeScript configuration and run Node.js test files from `dist/tests`.

Covered areas:

- User use cases
- Authentication use case
- Debt creation use case
- Installment payment use case

## Current Notes

- Controllers currently rely on thrown errors bubbling through Express. A centralized error handler is still needed.
- Some HTTP status codes follow the current implementation rather than ideal REST semantics, such as `GET /users` and `DELETE /users/:id` returning `201`.
- Authentication currently names the returned JWT as `refresh_token`, but the same token is used as a bearer token by the middleware.
- The transaction route surface is not implemented yet.

## Next Improvements

### Product Features

- Add endpoints to list debts, debt details, installments, and payment history.
- Add filters for debt status, debtor, creditor, due date, and overdue installments.
- Add debt update, cancellation, and settlement flows.
- Add refund and adjustment operations for payments.
- Add overdue calculation using `lateInterestRate` and `finePercent`.
- Add summaries for total owed, total receivable, paid amount, overdue amount, and monthly cash flow.
- Add user-facing ownership rules so each authenticated user only accesses allowed debts.

### REST API and Contract Quality

- Standardize HTTP status codes, especially list and delete routes.
- Add request validation for every route with consistent error responses.
- Introduce a global Express error middleware.
- Define stable response DTOs instead of returning raw persistence/domain objects.
- Add pagination, sorting, and filtering contracts for list endpoints.
- Add OpenAPI documentation when the public API stabilizes.

### Clean Architecture and Maintainability

- Keep controllers as thin HTTP adapters and move all business decisions into use cases.
- Add repository methods around query needs instead of leaking Prisma calls into application code.
- Separate transport DTOs, domain models, and persistence mapping consistently across modules.
- Replace generic `Error` throws with application-specific errors.
- Review dependency injection tokens and naming consistency.
- Add transaction-safe persistence for operations that update installments and create payment transactions together.

### Security

- Separate access token and refresh token responsibilities.
- Add token expiration handling and refresh-token rotation.
- Protect debt, installment, and payment routes with authentication and authorization.
- Avoid returning password hashes in user responses.
- Add rate limiting for authentication.
- Add stronger environment validation at startup.

### Performance and Reliability

- Add database indexes for common debt, installment, status, and due-date queries.
- Use database transactions for payment registration.
- Add integration tests for HTTP routes and Prisma repositories.
- Add production build and start scripts.
- Add CI checks for tests, TypeScript compilation, linting, and migrations.
