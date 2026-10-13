# Freelancer Project & Income Tracker

A full-stack web application designed for freelancers to manage their projects, clients, and income tracking.

## Description

This application allows freelancers to:
- Register and login securely with JWT authentication
- Manage client information
- Track project details, fees, and payments
- View dashboard with statistics and charts
- Search and filter projects
- Track income and payment history

## Features

- User Registration/Login with JWT Authentication
- Client Management (CRUD operations)
- Project Management with status tracking
- Income/Payment Tracking
- Dashboard with statistics and charts
- Search and Filter functionality for projects
- Responsive UI design
- Form validation and error handling
- MongoDB database integration

## Technologies

### Frontend
- React
- Vite
- React Router
- Axios
- Recharts (for charts)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication
- JWT (JSON Web Tokens)
- bcrypt.js (password hashing)

## Project Structure

```
freelancer-project-income-tracker/
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Layout.jsx
│ │ │ └── Layout.css
│ │ ├── pages/
│ │ │ ├── Login.jsx
│ │ │ ├── Register.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ ├── Clients.jsx
│ │ │ ├── Projects.jsx
│ │ │ ├── Income.jsx
│ │ │ └── NotFound.jsx
│ │ ├── services/
│ │ │ └── api.js
│ │ ├── context/
│ │ │ └── AuthContext.jsx
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ ├── package.json
│ ├── vite.config.js
│ ├── index.html
│ └── .env
│
├── backend/
│ ├── models/
│ │ ├── User.js
│ │ ├── Client.js
│ │ ├── Project.js
│ │ └── Payment.js
│ ├── routes/
│ │ ├── auth.js
│ │ ├── clients.js
│ │ ├── projects.js
│ │ ├── payments.js
│ │ └── dashboard.js
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── clientController.js
│ │ ├── projectController.js
│ │ ├── paymentController.js
│ │ └── dashboardController.js
│ ├── middleware/
│ │ └── auth.js
│ ├── config/
│ │ └── db.js
│ ├── server.js
│ ├── .env
│ └── package.json
│
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
MONGODB_URI=mongodb://localhost:27017/freelancer_tracker
JWT_SECRET=your_secret_key_here
PORT=5000
```

4. Start MongoDB (if using local MongoDB):
```bash
# On Windows with MongoDB installed as service
# MongoDB should be running automatically

# Or start MongoDB manually
mongod
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Environment Variables

### Backend (.env)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: Server port (default: 5000)

### Frontend (.env)
- `VITE_API_URL`: Backend API URL

## API Overview

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Clients
- `GET /api/clients` - Get all clients (protected)
- `POST /api/clients` - Create a new client (protected)
- `PUT /api/clients/:id` - Update a client (protected)
- `DELETE /api/clients/:id` - Delete a client (protected)

### Projects
- `GET /api/projects` - Get all projects (protected)
- `POST /api/projects` - Create a new project (protected)
- `PUT /api/projects/:id` - Update a project (protected)
- `DELETE /api/projects/:id` - Delete a project (protected)

### Payments
- `GET /api/payments` - Get all payments (protected)
- `POST /api/payments` - Create a new payment (protected)
- `DELETE /api/payments/:id` - Delete a payment (protected)

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics (protected)

