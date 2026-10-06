# TicPost

TicPost is a full-stack social network application developed to practice and apply concepts of modern web development across the frontend, backend, authentication, database, and API layers.

The platform allows users to create and manage posts, customize their profiles, and interact with the application through a responsive interface designed for both desktop and mobile devices.

## Features

* User registration with email verification
* Automatic login after email confirmation
* Secure authentication using JWT stored in HttpOnly cookies
* Login and logout
* User profiles with avatar and biography
* Profile editing
* Create, edit, and delete posts
* Server-side ownership validation for posts
* Paginated post loading
* Responsive navigation for desktop and mobile
* Password hashing with bcrypt
* Email delivery through Resend
* Profile image hosting through Cloudinary
* Request rate limiting for post creation

## Technologies

### Frontend

* React
* Vite
* React Router
* Axios
* CSS
* React Icons

### Backend

* Node.js
* Express
* Prisma
* MongoDB
* JWT
* bcryptjs
* Resend
* express-rate-limit

### External Services

* MongoDB Atlas
* Cloudinary
* Resend

## Project Structure

```text
TicPost/
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── prisma/
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
└── README.md
```

The frontend and backend are maintained in separate directories within the same repository.

## Authentication

TicPost uses JWT-based authentication with the token stored in an HttpOnly cookie, preventing direct access to the token from client-side JavaScript.

User passwords are hashed with bcrypt before being stored.

During registration, the user receives a verification code by email. The account is only created after the code is successfully verified.

Protected API routes use authentication middleware to validate the token and identify the authenticated user through `req.userId`.

## Data and API

The backend provides a REST API built with Express, with Prisma handling communication with MongoDB.

Operations involving user-owned content are validated on the server. For example, a user cannot edit or delete a post belonging to another account simply by modifying the request sent from the frontend.

Posts are also loaded using pagination to avoid requesting the entire collection at once.

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/devMathV/TicPost.git
cd TicPost
```

### 2. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd ../frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `backend` directory:

```env
DATABASE_URL=
JWT_SECRET=
RESEND_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Configure the frontend environment variables according to the API URL used by the application.

Do not commit `.env` files or other credentials to the repository.

### 4. Generate Prisma Client

Inside the backend directory:

```bash
npx prisma generate
```

### 5. Start the backend

```bash
npm run dev
```

### 6. Start the frontend

Inside the frontend directory:

```bash
npm run dev
```

## What This Project Demonstrates

TicPost was built as a practical full-stack project, with a focus on understanding how different parts of a web application work together.

The project demonstrates:

* Component-based frontend development with React
* Client-side routing
* REST API development
* Authentication and authorization
* HttpOnly cookie-based JWT authentication
* Database modeling with Prisma
* MongoDB integration
* Input and API validation
* Middleware architecture
* Pagination
* Responsive interface development
* Integration with external services
* Basic API abuse prevention through rate limiting

## Repository

GitHub: https://github.com/devMathV/TicPost

## Status

TicPost is currently under development. New features, improvements, and deployment configurations are being implemented progressively.