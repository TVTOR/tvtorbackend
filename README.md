# TVTOR Backend

TVTOR is a backend system for a tutoring platform, providing RESTful APIs for user management, subject/location/question management, notifications, tutor assignments, and more. This backend is built with Node.js, Express, and MongoDB, and is designed to support a scalable, multi-role tutoring application.

---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Overview](#api-overview)
- [Database Models](#database-models)
- [Project Structure](#project-structure)
- [Contribution](#contribution)
- [License](#license)

---

## Features
- User authentication (JWT-based) and role management (admin, tutor manager, tutor)
- User registration, login, password reset, and profile management
- Subject and location CRUD operations
- Question management and chatbot integration
- Tutor assignment and notification system (push notifications, SMS via Twilio)
- Device management for push notifications
- Commenting system for tutors and managers
- RESTful API design with versioning (`/api/v1`)

---

## Architecture
- **Express.js** server with modular routing and controllers
- **MongoDB** with Mongoose ODM for data persistence
- **JWT** for authentication and session management
- **Multer** for file uploads (user images)
- **FCM** and **Twilio** for notifications (push and SMS)
- **Environment-based configuration** (development, staging, production)

---

## Tech Stack
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- Multer
- FCM (Firebase Cloud Messaging)
- Twilio
- Nodemailer
- dotenv

---

## Getting Started

### Prerequisites
- Node.js (v12+ recommended)
- MongoDB instance (local or remote)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/simotaglia98/tvtorbackend.git
   cd tvtorbackend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment:**
   - Copy or edit the configuration files in `config/` as needed (see [Configuration](#configuration)).
   - Set environment variables as needed (see below).
4. **Start the server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000` by default.

---

## Configuration

Configuration is managed via the `config/` directory and environment variables:
- `NODE_ENV` determines which config file is loaded (`development`, `staging`, `production`).
- Main config values:
  - `MONGODB_URI`: MongoDB connection string
  - `JWT_SECRET`: Secret for JWT signing
  - `API_URL`: Base URL for the API
  - `EMAIL`/`PASSWORD`: Email credentials for notifications (if used)

Example `.env` (optional, for overriding):
```
NODE_ENV=development
SECRET=your_jwt_secret
```

---

## API Overview

All API endpoints are prefixed with `/api/v1`.

### Authentication & Users
- `POST   /api/v1/register` — Register a new user (tutor, manager, etc.)
- `POST   /api/v1/login` — User login
- `GET    /api/v1/users` — List all users
- `POST   /api/v1/forgotpassword` — Request password reset
- `PUT    /api/v1/resetpassword/:_id` — Reset password (JWT required)
- `PUT    /api/v1/updatepassword/:id` — Update password
- `DELETE /api/v1/user/logout/:id` — Logout
- `GET    /api/v1/user/:id` — Get user profile (JWT required)
- `PUT    /api/v1/user/:id` — Update user profile (JWT required, supports image upload)
- `DELETE /api/v1/user/:id` — Delete user (JWT required)

#### User Roles
- `tutormanager`, `admin`, `tutor` (see `models/User.js`)

### Subjects
- `POST   /api/v1/subject` — Create subject
- `GET    /api/v1/subject` — List all subjects
- `PUT    /api/v1/subject/:id` — Update subject
- `DELETE /api/v1/subject/:id` — Delete subject
- `GET    /api/v1/subject/:id` — Get single subject

### Locations
- `POST   /api/v1/location` — Create location
- `GET    /api/v1/location` — List all locations
- `PUT    /api/v1/location/:id` — Update location
- `DELETE /api/v1/location/:id` — Delete location
- `GET    /api/v1/location/:id` — Get single location
- `POST   /api/v1/getTutorsLocation` — Get tutors by location

### Questions
- `POST   /api/v1/question` — Get question (and handle chatbot logic)
- `GET    /api/v1/question` — Create question

### Notifications
- `POST   /api/v1/notification` — Create notification (JWT required)
- `GET    /api/v1/notification/:id` — Get notifications for manager (JWT required)

### Tutor Assignment
- `POST   /api/v1/assigntutor` — Assign tutor to student
- `GET    /api/v1/getStudentTutor/:email` — Get assigned tutor by student email
- `POST   /api/v1/getStudentTutor` — Get assigned tutor (by details)
- `GET    /api/v1/checkTutorAssignOrNot/:email` — Check if tutor is assigned

### Comments
- `POST   /api/v1/comments` — Create or update comment (JWT required)
- `GET    /api/v1/comments` — List comments (JWT required)

### Codes & Devices
- `POST   /api/v1/randomnumber` — Generate random code (JWT required)
- `POST   /api/v1/fcmdevices` — Register device for notifications (JWT required)

---

## Database Models

- **User**: name, surname, email, password, location(s), subject(s), userType, etc.
- **Subjects**: subject, colorcode
- **Locations**: location
- **Questions**: question, options, type, etc.
- **Notification**: tmId, subject, location, message, queryData
- **TutorAssign**: name, email, subject, location, tutorId, notificationId
- **Comment**: comment, tutorId, managerId
- **Device**: deviceId, deviceType, deviceToken, tmId
- **Session**: userId, token

---

## Project Structure

```
tvtorbackend/
  config/         # Environment configs
  controllers/    # API controllers
  helper/         # Helper utilities (auth, mail)
  lib/            # Constants
  models/         # Mongoose models
  public/         # Static files (chatbot, images)
  routers/        # Express routers
  services/       # Business logic/services
  validator/      # JWT validation
  server.js       # App entry point
  package.json    # Dependencies
  README.md       # This file
```

---

## Contribution

Contributions are welcome! To contribute:
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and submit a pull request

Please follow the existing code style and add tests where appropriate.

---

## License

This project is licensed under the ISC License.

---

## Maintainers
- [simotaglia98](https://github.com/simotaglia98)

---

## References
- [Project Repository](https://github.com/simotaglia98/tvtorbackend)
