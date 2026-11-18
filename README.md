# Teacher-Student Session Booking API

A RESTful backend application built with Node.js, Express.js, TypeScript, and MongoDB that allows users to book sessions with teachers.

The application provides APIs for user registration, teacher registration, session creation, checking available sessions, booking sessions, and tracking upcoming and completed sessions.

## Features

- User registration with input validation.
- Teacher registration with specialization and experience details.
- Create sessions for registered teachers.
- Retrieve available sessions for a specific date.
- Book available sessions for registered users.
- Prevent multiple users from booking the same session.
- Mark booked sessions as completed.
- Retrieve upcoming and completed sessions for a user.
- Input validation using Zod.
- Centralized error handling.
- MongoDB integration using Mongoose.
- Security headers using Helmet and CORS support.

## Tech Stack

- **Runtime:** Node.js
- **Backend Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB
- **ODM:** Mongoose
- **Validation:** Zod
- **Security:** Helmet
- **Middleware:** CORS, dotenv
- **Development:** tsx

## Prerequisites

Make sure you have the following installed:

- Node.js (22 or later recommended)
- npm
- MongoDB (local installation or MongoDB Atlas)
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MukeshGit9/booking_session.git
```

### 2. Navigate to the Project Directory

```bash
cd booking_session
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory.

```env
PORT=4000
MONGO_URL=your_mongo_db_atlas_string
```

For MongoDB Atlas, replace the `MONGO_URL` value with your MongoDB connection string.

### 5. Run the Development Server

```bash
npm run dev
```

The server will start at:

```text
http://localhost:4000
```

You should see a successful MongoDB connection message and the server port in the terminal.

### 6. Build for Production

Compile TypeScript into JavaScript:

```bash
npm run build
```

### 7. Start the Production Server

```bash
npm start
```

## API Documentation

### Base URL

```text
http://localhost:4000/api/v1
```

All API endpoints are prefixed with `/api/v1`.

### API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users` | Register a new user |
| GET | `/users/:id/sessions` | Get user's upcoming and completed sessions |
| POST | `/teachers` | Register a new teacher |
| POST | `/sessions` | Create a new session |
| GET | `/sessions/available` | Get available sessions by date |
| POST | `/sessions/:id/book` | Book an available session |
| PATCH | `/sessions/:id/complete` | Mark a booked session as completed |

---

## 1. User APIs

### Register a User

**Endpoint:** `POST /users`

Registers a new user.

**Request Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210"
}
```

**Validation:**
- `fullName`: Required, 2–100 characters.
- `email`: Required, valid email address.
- `phone`: Required, exactly 10 digits after removing non-numeric characters.

**Success Response (200):**

```json
{
  "success": true,
  "message": "User created successfully!",
  "data": {
    "_id": "USER_ID",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": 9876543210
  }
}
```

### Get User Sessions

**Endpoint:** `GET /users/:id/sessions`

Retrieves the upcoming and completed sessions associated with a user.

**URL Parameter:**

| Parameter | Description |
|---|---|
| `id` | MongoDB ObjectId of the user |

**Example:**

```http
GET /api/v1/users/USER_ID/sessions
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "upcomingSessions": [
      {
        "_id": "SESSION_ID",
        "teacherId": "TEACHER_ID",
        "userId": "USER_ID",
        "startTime": "2026-11-20T10:00:00.000Z",
        "endTime": "2026-11-20T11:00:00.000Z",
        "status": "BOOKED"
      }
    ],
    "completedSessions": []
  }
}
```

The upcoming sessions are sorted by start time in ascending order. Completed sessions are sorted by completion time.

---

## 2. Teacher APIs

### Register a Teacher

**Endpoint:** `POST /teachers`

Registers a new teacher.

**Request Body:**

```json
{
  "fullName": "Robert Smith",
  "email": "robert@example.com",
  "specialization": "Mathematics",
  "experience": "5 years"
}
```

**Validation:**
- `fullName`: Required, 2–100 characters.
- `email`: Required, valid email address.
- `specialization`: Required, 2–100 characters.
- `experience`: Required string value.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Teacher created successfully!",
  "data": {
    "_id": "TEACHER_ID",
    "fullName": "Robert Smith",
    "email": "robert@example.com",
    "specialization": "Mathematics",
    "experience": "5 years"
  }
}
```

---

## 3. Session APIs

### Create a Session

**Endpoint:** `POST /sessions`

Creates a new session for an existing teacher.

**Request Body:**

```json
{
  "teacherId": "TEACHER_ID",
  "userId": null,
  "startTime": "2026-11-20T10:00:00.000Z",
  "endTime": "2026-11-20T11:00:00.000Z",
  "status": "AVAILABLE",
  "completedAt": null
}
```

**Validation:**
- `teacherId`: Required, valid MongoDB ObjectId.
- `userId`: Nullable, defaults to `null`.
- `startTime`: Required, valid date.
- `endTime`: Required, valid date and must be after `startTime`.
- `status`: `AVAILABLE`, `BOOKED`, or `COMPLETED`. Defaults to `AVAILABLE`.
- `completedAt`: Nullable, defaults to `null`.
- An available session must not have a user assigned.
- A booked session must have a user assigned.
- A completed session must have both a user and completion date.

The referenced teacher must exist.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Session created successfully!",
  "data": {
    "_id": "SESSION_ID",
    "teacherId": "TEACHER_ID",
    "userId": null,
    "startTime": "2026-11-20T10:00:00.000Z",
    "endTime": "2026-11-20T11:00:00.000Z",
    "status": "AVAILABLE",
    "completedAt": null
  }
}
```

### Get Available Sessions by Date

**Endpoint:** `GET /sessions/available`

Retrieves all available sessions for a particular UTC calendar date, sorted by start time.

**Query Parameters:**

| Parameter | Required | Description |
|---|---|---|
| `dateTimestamp` | Yes | Unix timestamp in milliseconds representing the requested date |

**Example:**

```http
GET /api/v1/sessions/available?dateTimestamp=1795132800000
```

**Success Response (200):**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "SESSION_ID",
      "teacherId": "TEACHER_ID",
      "userId": null,
      "startTime": "2026-11-20T10:00:00.000Z",
      "endTime": "2026-11-20T11:00:00.000Z",
      "status": "AVAILABLE",
      "completedAt": null
    }
  ]
}
```

Only sessions with `AVAILABLE` status and a start time within the requested UTC day are returned.

### Book an Available Session

**Endpoint:** `POST /sessions/:id/book`

Books an available session for a registered user.

**URL Parameter:**

| Parameter | Description |
|---|---|
| `id` | MongoDB ObjectId of the session |

**Request Body:**

```json
{
  "userId": "USER_ID"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Session booked successfully!",
  "data": {
    "_id": "SESSION_ID",
    "teacherId": "TEACHER_ID",
    "userId": "USER_ID",
    "startTime": "2026-11-20T10:00:00.000Z",
    "endTime": "2026-11-20T11:00:00.000Z",
    "status": "BOOKED"
  }
}
```

**Business Rules:**
- The session must exist.
- The user must exist.
- Only sessions with `AVAILABLE` status can be booked.
- Once booked, the session status changes to `BOOKED`.
- The booking operation uses a conditional MongoDB update to prevent concurrent bookings of the same session.

### Mark a Session as Completed

**Endpoint:** `PATCH /sessions/:id/complete`

Marks a booked session as completed.

**URL Parameter:**

| Parameter | Description |
|---|---|
| `id` | MongoDB ObjectId of the session |

No request body is required.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Session marked as completed successfully",
  "data": {
    "_id": "SESSION_ID",
    "teacherId": "TEACHER_ID",
    "userId": "USER_ID",
    "startTime": "2026-11-20T10:00:00.000Z",
    "endTime": "2026-11-20T11:00:00.000Z",
    "status": "COMPLETED",
    "completedAt": "2026-11-20T11:05:00.000Z"
  }
}
```

**Business Rules:**
- The session must exist.
- Only sessions with `BOOKED` status can be completed.
- The status changes to `COMPLETED`.
- `completedAt` is automatically set to the current date and time.

---

## Session Lifecycle

A session follows these status transitions:

```text
AVAILABLE
    |
    | User books session
    v
BOOKED
    |
    | Mark session as completed
    v
COMPLETED
```

A session cannot be booked again after booking, and only booked sessions can be marked as completed.

## Error Handling

The application uses centralized error-handling middleware to return consistent error responses.

| HTTP Status | Description |
|---|---|
| 400 | Invalid request, validation failure, or invalid ID |
| 404 | Requested user, teacher, or session not found |
| 409 | Duplicate record or session conflict |
| 500 | Internal server error |

**Example Error Response:**

```json
{
  "success": false,
  "message": "Session is already booked or Unavailable"
}
```

Zod validation errors and database validation errors are handled separately by the validation and error-handling middleware.

## Testing the APIs

You can test the endpoints using Postman or any REST API client.

Recommended testing sequence:

1. Register a teacher using `POST /teachers`.
2. Register a user using `POST /users`.
3. Create a session using `POST /sessions`, passing the teacher ID.
4. Find available sessions using `GET /sessions/available`.
5. Book a session using `POST /sessions/:id/book`, passing the user ID.
6. Retrieve the user's sessions using `GET /users/:id/sessions`.
7. Complete the session using `PATCH /sessions/:id/complete`.
8. Retrieve the user's sessions again to verify the completed session.

## Project Structure

```text
booking_session/
│
├── src/
│   ├── config/
│   │   ├── db/
│   │   │   └── mongo/
│   │   │       └── connection.ts
│   │   └── env.ts
│   │
│   ├── middlewares/
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   │
│   ├── modules/
│   │   ├── user/
│   │   ├── teacher/
│   │   └── session/
│   │
│   ├── utils/
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

Each module follows a modular structure with separate routes, controllers, services, repositories, models, and validation schemas where applicable.

## Available NPM Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with automatic reload |
| `npm run build` | Compile TypeScript into JavaScript |
| `npm start` | Start the compiled production server |

## Author

**Mukesh Kumar**

GitHub: [MukeshGit9](https://github.com/MukeshGit9)

Repository: [booking_session](https://github.com/MukeshGit9/booking_session)
