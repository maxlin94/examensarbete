# Real-Time Chat Application

This is a real-time chat application built with React, Next.js, Socket.IO, and PostgreSQL. The application supports user authentication, real-time messaging, friend requests, and notifications.

---

## Features

- User registration and login with secure password hashing via bcrypt
- Real-time messaging and notifications using Socket.IO
- Friend requests and friend management
- Message pagination for improved performance
- Client-side state management using Zustand
- API validation with Zod
- Backend and database powered by Next.js API routes and Prisma ORM

---

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Make sure you have the following installed:

- Node.js (>= 16.x)
- PostgreSQL (>= 13.x)
- A package manager like npm or yarn

---

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/chat-app.git
   cd chat-app
   ```

2. **Install Dependencies**
   Run the following command to install required dependencies:
   ```bash
   npm install
   ```

3. **Set Up the Database**

   - Create a PostgreSQL database.
   - Create `.env` and update the database connection URL:
     ```env
     DATABASE_URL=postgresql://username:password@localhost:5432/database_name
     ```

   - Run Prisma migrations to set up the database schema:
     ```bash
     npx prisma migrate dev
     ```

4. **Set Up Authentication**
   Update the `.env` file with the necessary credentials for NextAuth:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   ```

5. **Start the Development Server**
   Run the following command to start the app in development mode:
   ```bash
   npm run dev
   ```

   The application should now be accessible at `http://localhost:3000`.

---

## Scripts

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the application for production.
- **`npm start`**: Starts the production server.
- **`npx prisma studio`**: Opens Prisma Studio to explore the database.

---
