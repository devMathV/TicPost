# TicPost

**A full-stack social network built with React, Node.js, Express, Prisma, and MongoDB.**

[**Live Demo**](https://devmathv.github.io/TicPost/) · [Source Code](https://github.com/devMathV/TicPost)

TicPost is a social network project focused on building a complete web application, from the user interface to the backend and database. It provides a space for users to create posts, manage their profiles, and share content through a responsive interface.

## Features

- **Account management:** Registration, email verification, login, and logout.
- **Authentication:** JWT-based authentication using HttpOnly cookies.
- **User profiles:** Profile information, avatar, and biography management.
- **Post management:** Create, edit, and delete posts.
- **Access control:** Server-side validation to ensure users can only modify their own posts.
- **Pagination:** Posts are loaded in pages instead of requesting the entire collection at once.
- **Responsive interface:** Navigation and layouts adapted for desktop and mobile devices.
- **Email verification:** Registration codes sent through Resend.
- **Image hosting:** Profile images managed through Cloudinary.
- **Request rate limiting:** Limits on post creation to help prevent abuse.

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS
- React Icons

### Backend

- Node.js
- Express
- Prisma ORM
- MongoDB
- JSON Web Tokens (JWT)
- bcryptjs
- express-rate-limit
- Resend SDK

### External Services

- **MongoDB Atlas:** Database hosting.
- **Cloudinary:** Image hosting and management.
- **Resend:** Transactional email delivery.
- **GitHub Pages:** Frontend hosting.
- **Render:** Backend hosting.

## Project Structure

```text
TicPost/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middlewares/
│   │   ├── services/
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
│
├── .github/
│   └── workflows/
├── .gitignore
└── README.md
```

The frontend and backend share one repository but are deployed independently.

## Authentication and Security

TicPost uses JWTs stored in HttpOnly cookies, preventing client-side JavaScript from directly reading the authentication token. Passwords are hashed with bcryptjs before being stored.

Registration requires email verification before a user account is created. Verification codes are stored as hashes and have an expiration time.

Protected operations use authentication middleware, while ownership checks are performed on the server rather than relying on information supplied by the frontend.

## Running Locally

### Prerequisites

- Node.js and npm
- A MongoDB database
- Credentials for the external services used by the application

### 1. Clone the repository

```bash
git clone https://github.com/devMathV/TicPost.git
cd TicPost
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure backend environment variables

Create a `.env` file inside `backend/`:

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
FRONTEND_URL=

RESEND_API_KEY=
RESEND_FROM_EMAIL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Fill in the values required by your environment. Never commit this file or expose API keys, database credentials, or JWT secrets.

### 4. Generate Prisma Client

From the `backend/` directory, run:

```bash
npx prisma generate
```

If you are setting up a new database, synchronize its schema according to the project's Prisma configuration before starting the application.

### 5. Start the backend

```bash
npm run server
```

### 6. Configure and start the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:3000
```

Start Vite:

```bash
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## Deployment

The application uses separate hosting services for the frontend and backend.

- The frontend is built with Vite and deployed to GitHub Pages through GitHub Actions.
- The backend runs on Render.
- MongoDB Atlas provides the database.
- Resend handles transactional emails using the verified `mail.ticpost.com.br` sending domain.
- Cloudinary manages profile images.

Production environment variables must be configured in the relevant hosting dashboards. The frontend build uses `VITE_API_URL` to identify the deployed backend API.

## Project Goals

TicPost is a practical full-stack development project built to strengthen my understanding of:

- React component architecture and client-side routing.
- REST API design and backend organization.
- Authentication, authorization, and secure cookie handling.
- Database modeling with Prisma and MongoDB.
- Form validation and error handling.
- Pagination and responsive interface design.
- Integration with external services.
- Deployment and environment configuration.

## Status

TicPost is an ongoing personal project. Its implementation and deployment are being refined as new features and improvements are introduced.