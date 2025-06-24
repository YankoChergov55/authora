# **Authora**

> Lightweight authentication API with input validation, JWT-based authentication and testing implemented using Node.js, Express, and MongoDB.

## 🚀 Overview

### **Authora** is a foundational backend service focused on secure authentication and robust data validation. It's part of a broader learning mission to master backend development through real-world implementations.

---

## 🔧 Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB + Mongoose
- **Validation**: Zod (schema + request validation)
- **Security**: bcryptjs, helmet
- **Auth**: JWT (Access & Refresh Tokens, cookie-based)
- **Logging**: Pino
- **Testing**: Jest + Supertest (unit & integration)
- **Environment Config**: dotenv
- **Tooling**: ESLint + Prettier, Nodemon

---

## 🔐 Environment Variables

This project uses a `.env` file to manage environment-specific configurations. You must create a `.env` file in the root directory to run the project successfully.

## 🔐 Environment Variables

This project uses environment-specific `.env` files to manage configuration for development and testing.
You **must create** the following files in your project root:

### `.env` (for development)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/authora
NODE_ENV=development

JWT_SECRET_ACCESS=your_access_secret_here
JWT_SECRET_REFRESH=your_refresh_secret_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

---

### `.env.test` (for testing)

```env
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/authora_test

JWT_SECRET_ACCESS=your_test_access_secret
JWT_SECRET_REFRESH=your_test_refresh_secret
JWT_ACCESS_EXPIRY=10s
JWT_REFRESH_EXPIRY=30s
```

> **Note**: The test environment uses a separate database (`.env.test`) to isolate test data and prevent pollution of the development database.
> Make sure your test script sets `NODE_ENV=test` to load this file:

```json
"scripts": {
  "test": "NODE_ENV=test jest --runInBand --detectOpenHandles",
  "test:watch": "NODE_ENV=test jest --runInBand --detectOpenHandles --watch"
}
```

---

### 🔸 Important Notes

- `MONGODB_URI`: Replace with your actual connection string if you're using a remote MongoDB instance (e.g., MongoDB Atlas).
- `JWT_SECRET` and `JWT_REFRESH_SECRET`: Use long, randomly generated strings in production to protect token integrity.
- **Never commit your `.env` file** — it should always be in your `.gitignore`.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance running (local or cloud)

### Install Dependencies

```bash
npm install
```

### Run in Dev Mode

```bash
npm run dev
```

---

## ✅ Implemented

Absolutely. Here's the updated section to reflect the full scope of what you've implemented:

---

## ✅ Implemented

- [x] Express server and middleware stack set up
- [x] MongoDB connection via Mongoose
- [x] Logging with Pino + HTTP logger
- [x] Basic error handling framework ready
- [x] Zod-based input validation for all endpoints
- [x] JWT-based authentication (access + refresh tokens)
- [x] Secure cookie handling for refresh token flow
- [x] `authenticate` middleware for protected route access
- [x] `authorize` middleware for role-based access control
- [x] User profile route (`/profile`)
- [x] Admin-only route to list all users (`/admin`)
- [x] Full login, refresh, and logout flow
- [x] Unit tests for middleware and core logic
- [x] Integration tests for all routes with real DB
- [x] Separate test database with `.env.test` config
- [x] Test coverage for error handling, route protection, and token lifecycle

---

## 📌 Notes

This project is part of a deeper backend development journey — not a clone, but a self-driven scenario designed to build precision, resilience, and real-world readiness. While this version focuses on core authentication, input validation, and testing, it represents the starting line, not the finish.

The next phase will take these same principles further:

    Rebuilding the stack using TypeScript + Express + MongoDB

    Adding user-controlled entities (e.g., Todo, Product)

    Applying robust validation, authentication, and testing to every feature

    Designing systems that scale in both structure and complexity

This isn’t just about writing code — it’s about mastering how backend systems behave, protect themselves, and evolve.
