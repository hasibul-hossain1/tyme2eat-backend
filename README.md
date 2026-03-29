# MealHub Backend

MealHub Backend is a TypeScript + Express API for a food ordering platform. It handles authentication, user roles, seller onboarding, meal and category management, customer orders, and meal reviews.

The project uses Better Auth for email/password authentication with email verification, Prisma for PostgreSQL access, and Nodemailer for verification emails. The API is organized by feature modules under `src/modules`.

## Features

- Email/password authentication with Better Auth
- Email verification before protected access
- Role-based access control for `CUSTOMER`, `SELLER`, and `ADMIN`
- Seller account creation and seller profile completion
- Meal CRUD for sellers
- Public meal listing with search, filtering, sorting, and pagination
- Category management for admins
- Customer order creation and order history
- Meal reviews from authenticated customers
- Default admin seeding on server startup

## Tech Stack

- Node.js
- TypeScript
- Express 5
- Prisma 7
- PostgreSQL
- Better Auth
- Nodemailer
- Vercel-ready server config

## Project Structure

```text
src/
  app/            Express app setup
  config/         Environment config loader
  helper/         Shared helpers such as pagination
  lib/            Prisma and Better Auth setup
  middleware/     Auth and global error middleware
  modules/        Feature modules (admin, meals, order, seller, user)
  routes/         API route registration
  seed/           Default admin seed logic
  utils/          Shared utilities
prisma/
  migrations/     Prisma migrations
  schema/         Split Prisma schema files
```

## Data Model Overview

The database is centered around these entities:

- `User`: application user with role, session, and auth account data
- `Seller`: seller profile connected one-to-one with a user
- `Category`: meal category
- `Meal`: food item created by a seller and assigned to a category
- `Order`: customer order with delivery address and status
- `OrderItem`: meal entries inside an order
- `Review`: one review per user per meal

Order statuses are:

- `PENDING`
- `CONFIRMED`
- `COOKING`
- `DELIVERED`
- `CANCELLED`

## API Overview

Base API prefix: `http://localhost:5000/api/v1`

Main route groups:

- `/auth/*`: Better Auth endpoints for sign up, sign in, session handling, and email verification
- `/user`: current user profile, user update, and admin-only user management
- `/seller`: seller registration, seller profile, seller meals, and seller order management
- `/meals`: public meal browsing, categories, reviews, and cart item lookup
- `/orders`: customer order creation and customer order history
- `/admin`: admin category management and full order retrieval

Root health check:

- `GET /` -> returns `"The server is working"`

### Route Summary

#### Auth

Authentication is mounted through Better Auth at:

- `ALL /api/v1/auth/{*any}`

This includes the Better Auth email/password flows and session endpoints.

#### User

- `GET /api/v1/user/me`
- `GET /api/v1/user`
- `PATCH /api/v1/user/:id`
- `POST /api/v1/user/update`

#### Seller

- `POST /api/v1/seller/create-account`
- `GET /api/v1/seller`
- `GET /api/v1/seller/:id`
- `GET /api/v1/seller/my-seller-profile`
- `PATCH /api/v1/seller/complete-profile`
- `GET /api/v1/seller/meals`
- `POST /api/v1/seller/meals`
- `PATCH /api/v1/seller/meals/:id`
- `DELETE /api/v1/seller/meals/:id`
- `GET /api/v1/seller/orders`
- `PATCH /api/v1/seller/orders/:id`

#### Meals

- `GET /api/v1/meals`
- `GET /api/v1/meals/categories`
- `GET /api/v1/meals/:id`
- `POST /api/v1/meals/:id`
- `POST /api/v1/meals/cart`

`GET /api/v1/meals` supports:

- `search`
- `category`
- `minPrice`
- `maxPrice`
- `available`
- `sortBy`
- `sortOrder`
- `page`
- `limit`

#### Orders

- `POST /api/v1/orders`
- `GET /api/v1/orders`
- `GET /api/v1/orders/:id`
- `GET /api/v1/orders/me/:id`

#### Admin

- `POST /api/v1/admin/create-category`
- `DELETE /api/v1/admin/delete-category/:id`
- `GET /api/v1/admin/all-meal`

## Getting Started

### Prerequisites

- Node.js with ESM support
- PostgreSQL database
- A Gmail account with an app password for sending verification emails

### 1. Install dependencies

```bash
npm install
```

### 2. Create the environment file

Create a `.env` file in the project root. You can use `.env.example` as a reference, but replace the values with your own local or deployment values.

Example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mealhub?schema=public"
PORT=5000

BETTER_AUTH_SECRET="replace-with-a-long-random-secret"
BETTER_AUTH_URL="http://localhost:5000"

GMAIL_USER="your-email@gmail.com"
GMAIL_PASS="your-gmail-app-password"

DEFAULT_ADMIN_EMAIL="admin@example.com"
DEFAULT_ADMIN_PASS="strong-admin-password"
```

### 3. Generate the Prisma client

```bash
npm run pg
```

### 4. Run database migrations

```bash
npm run pm
```

### 5. Start the development server

```bash
npm run dev
```

The server starts on:

```text
http://localhost:5000
```

### 6. Build for production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev`: start the development server with `tsx watch`
- `npm run build`: compile TypeScript into `dist/`
- `npm start`: run the compiled server from `dist/server.js`
- `npm run pm`: run `prisma migrate dev`
- `npm run pg`: generate the Prisma client into `src/generated/prisma`
- `npm run ps`: open Prisma Studio

## Authentication and Roles

- Protected routes use session-based auth through Better Auth
- Email verification is required before protected access is granted
- Role checks are enforced by `authMiddleware`
- Supported roles are `CUSTOMER`, `SELLER`, and `ADMIN`

## Default Admin Seeding

On server startup, the app runs `seedAdmin()` from `src/seed/seedAdmin.ts`.

If the admin user from `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_PASS` does not exist, it is created automatically and marked as email verified.

## CORS and Frontend Access

The API currently allows credentials and is configured for these origins:

- `http://localhost:3000`
- `http://192.168.0.30:3000`
- `https://tyme2eat.vercel.app`

If your frontend runs on a different origin, update the CORS configuration in `src/app/index.ts`.

## Deployment Notes

- The project includes a `vercel.json` file
- Vercel is configured to serve `dist/server.js`
- Build the project before deployment so the `dist/` output is up to date

## Notes

- There is no automated test script configured in `package.json`
- Prisma uses the split schema directory at `prisma/schema`
- The server logs every incoming request with method and URL
