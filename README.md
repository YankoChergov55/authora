# **Authora**

> Lightweight authentication API with input validation, JWT-based authentication and testing implemented using Node.js, Express, and MongoDB.

## 🚀 Overview

### **Authora** is a foundational backend service focused on secure authentication and robust data validation. It's part of a broader learning mission to master backend development through real-world implementations.

---

## 🔧 Stack

* **Runtime**: Node.js
* **Framework**: Express
* **Database**: MongoDB (via Mongoose)
* **Validation**: Zod
* **Security**: bcryptjs, helmet
* **Auth**: JWT (Access + Refresh tokens)
* **Logging**: Pino
* **Environment Config**: dotenv
* **Tooling**: ESLint + Prettier, Nodemon

---

## 🔐 Environment Variables

This project uses a `.env` file to manage environment-specific configurations. You must create a `.env` file in the root directory to run the project successfully.

### Example `.env`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/s1-auth-db
NODE_ENV=development
```

### 🔸 Important Notes

* `MONGODB_URI`: Replace with your actual connection string if you're using a remote MongoDB instance (e.g., MongoDB Atlas).
* `JWT_SECRET` and `JWT_REFRESH_SECRET`: Use long, randomly generated strings in production to protect token integrity.
* **Never commit your `.env` file** — it should always be in your `.gitignore`.


## 🛠️ Getting Started

### Prerequisites

* Node.js (v18+ recommended)
* MongoDB instance running (local or cloud)

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

* [x] Express server and middleware stack set up
* [x] MongoDB connection via Mongoose
* [x] Logging with Pino + HTTP logger
* [x] Basic error handling framework ready

## 📌 Notes

This project is part of a deeper backend journey — not a clone, but a scenario to develop precision, resilience, and real-world readiness.
