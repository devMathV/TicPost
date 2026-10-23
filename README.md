# TicPost

**A full-stack social network built with React, Node.js, Express, Prisma, and MongoDB.**

[**Live Demo**](https://ticpost.com.br) · [Source Code](https://github.com/devMathV/TicPost)

TicPost is a social network developed as a full-stack web application. It allows users to create posts, manage their profiles, and share content through a responsive interface designed for desktop and mobile devices.

## Features

- **Account management:** Registration, email verification, login, and logout.
- **Authentication:** JWT-based authentication using HttpOnly cookies.
- **User profiles:** Profile information, avatar, and biography management.
- **Post management:** Create, edit, and delete posts.
- **Access control:** Server-side validation to prevent users from modifying posts belonging to other accounts.
- **Pagination:** Posts are loaded in pages to avoid requesting the entire collection at once.
- **Responsive interface:** Layouts and navigation adapted for desktop and mobile devices.
- **Email verification:** Registration codes sent through Resend.
- **Image hosting:** Profile images managed through Cloudinary.
- **Rate limiting:** Request limits to help prevent abuse of authentication and post creation endpoints.

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
- **Cloudinary:** Profile image hosting.
- **Resend:** Transactional email delivery.
- **GitHub Pages:** Frontend hosting.
- **Render:** Backend hosting.

## Project Structure

```text
TicPost/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middlewares/
│   │   ├── services/
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
│
├── .github/
│   └── workflows/
├── CNAME
├── .gitignore
└── README.md
```

The frontend and backend share one repository but are deployed independently.

## Authentication and Security

TicPost uses JWTs stored in HttpOnly cookies, preventing client-side JavaScript from directly accessing the authentication token. Passwords are hashed with bcryptjs before being stored.

During registration, users receive a verification code by email. The account is created only after the code is successfully verified. Verification codes are stored as hashes and have an expiration time.

Protected endpoints use authentication middleware, and authorization checks are performed on the server rather than relying on information supplied by the frontend.

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
FRONTEND_URL=http://localhost:5173

RESEND_API_KEY=
RESEND_FROM_EMAIL="TicPost <no-reply@mail.ticpost.com.br>"

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Fill in the values required by your environment. Never commit `.env` files or expose API keys, database credentials, or JWT secrets.

### 4. Generate Prisma Client

From the `backend/` directory, run:

```bash
npx prisma generate
```

If you are setting up a new database, synchronize its schema using the appropriate Prisma command for the project's configuration.

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

Start the development server:

```bash
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## Deployment

TicPost uses separate services for the frontend, backend, database, and transactional emails.

- The frontend is deployed to GitHub Pages at [ticpost.com.br](https://ticpost.com.br).
- The backend is hosted on Render.
- MongoDB Atlas provides the database.
- Resend handles transactional emails using the verified `mail.ticpost.com.br` sending domain.
- Cloudinary manages profile images.

Production environment variables are configured through the respective hosting dashboards. The frontend build receives `VITE_API_URL` through GitHub Actions to identify the deployed API.

## Project Goals

TicPost is a practical full-stack development project focused on improving my understanding of:

- Component-based frontend development and client-side routing.
- REST API design and backend architecture.
- Authentication, authorization, and secure cookie handling.
- Database modeling with Prisma and MongoDB.
- Input validation and error handling.
- Pagination and responsive interface design.
- Integration with external services.
- Deployment and environment configuration.

## Status

TicPost is an ongoing personal project. The application is publicly accessible, and its features and infrastructure continue to be refined as the project evolves.