# NoboNG

A simplified cross-border e-commerce platform that demonstrates the:

**Product → Cart → Checkout → Payment → Order**

journey.

Customers can view products, add products to their cart, complete checkout, make a simulated payment, and create an order.

## Technologies Used

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand
- React Hook Form
- Zod

### Backend

- NestJS
- TypeScript
- REST API
- Prisma
- PostgreSQL

### Testing

- Jest
- Vitest

## Running the Application

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL

### 1. Clone the repository

    git clone <repository-url>
    cd nobong-assessment

### 2. Setup the Backend

Go to the backend folder:

    cd backend

Install the dependencies:

    pnpm install

Create a `.env` file inside the `backend` folder:

    DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/nobong"

Do not commit `.env` files or any sensitive information to the repository.

Run the database migrations:

    pnpm db:deploy

Seed the database:

    pnpm db:seed

Start the backend:

    pnpm start:dev

The backend will run on:

    http://localhost:4000/api

### 3. Setup the Frontend

Open another terminal and go to the project root:

    cd nobong-assessment

Go to the frontend folder:

    cd frontend

Install the dependencies:

    pnpm install

Start the frontend:

    pnpm dev

The frontend will run on:

    http://localhost:3000

## Project / Architecture Structure

The project is separated into a frontend and backend application.

### Frontend

The frontend uses a feature-based structure. Each feature contains the code related to that feature.

    frontend/
    └── src/
        ├── app/
        ├── features/
        │   ├── products/
        │   ├── cart/
        │   ├── checkout/
        │   ├── payments/
        │   └── orders/
        ├── components/
        ├── lib/
        └── types/

Each feature exports through an `index.ts` barrel, so pages can import from the feature instead of accessing internal files directly.

### Backend

The backend uses a module-based structure, where each module represents a business feature.

    backend/
    └── src/
        ├── config/
        ├── common/
        ├── database/
        ├── products/
        ├── customers/
        ├── pricing/
        ├── orders/
        ├── payments/
        ├── shipments/
        └── logistics/

The controllers handle requests, while the services contain the business logic.

## Key Technical Decisions

### Feature-based frontend

Features such as Products, Cart, Checkout, Payments, and Orders are separated to keep the frontend clean and easy to maintain.

### Modular backend

The backend is divided into modules based on business features such as Products, Orders, Payments, Shipments, and Logistics.

### Server-side pricing

The backend is responsible for calculating the product subtotal, shipping cost, and total amount.

The frontend is not trusted to provide the final price.

### Payment confirmation

The payment flow is simulated for this assessment.

In a real payment integration, the payment provider would send a webhook to the backend. The backend would verify the payment reference, amount, and status before updating the payment and order.

### Idempotent payments

Each payment request uses an idempotency key to prevent the same payment from being processed twice if a request is retried.

### Order and Shipment

Order and Shipment are separate entities.

The order represents the customer's purchase:

    PENDING_PAYMENT
    → PAID
    → PROCESSING
    → SHIPPED
    → DELIVERED

The shipment represents the physical delivery:

    CREATED
    → PICKED_UP
    → IN_TRANSIT
    → OUT_FOR_DELIVERY
    → DELIVERED

For now, NoboNG can manage delivery itself. Later, logistics providers such as DHL or FedEx can be added through the logistics module.

### Database

PostgreSQL is used for persistent data, with Prisma used for database access and migrations.

Appropriate database indexes are used for frequently queried fields, and Prisma manages the database connection pool.

## Assumptions Made

- Product data is mock data.
- No external e-commerce API is required.
- Payment is simulated and no real payment gateway is used.
- No card details or payment credentials are stored.
- Authentication is not included because it is outside the scope of this assessment.
- NoboNG initially manages delivery itself.
- A logistics provider can be added later.
- Shipping cost uses a simple predefined pricing rule.
- The application supports guest checkout.

## What I Would Improve With More Time

If I had more time, I would:

- Integrate a real payment provider.
- Add authentication and authorization.
- Integrate logistics providers such as DHL and FedEx.
- Add real-time shipment tracking.
- Add Redis caching where needed.
- Add background jobs for emails, notifications, invoices, and shipment processing.
- Add more unit, integration, and end-to-end tests.
- Add CI/CD for automated testing and deployment.
- Add monitoring and better application logging.
- Add automated database backups and point-in-time recovery.
- Add database replicas and horizontal scaling as traffic grows.
- Improve product search, filtering, and pagination.
- Add rate limiting and additional security controls.