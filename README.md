# FreelaTrack — Freelancer Project & Income Tracker

FreelaTrack is a full-stack web application designed to help freelancers organize their clients, manage projects, track payments, and understand their income from one dashboard. It provides a central place to monitor project progress and financial activity instead of maintaining separate spreadsheets or notes.

> **Important:** Review this README against your final source code before publishing. Keep only features that are actually implemented and working in your repository.

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Objectives](#objectives)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Using FreelaTrack](#using-freelatrack)
- [API Overview](#api-overview)
- [Security and Validation](#security-and-validation)
- [Screenshots](#screenshots)
- [Testing Checklist](#testing-checklist)
- [Version Control](#version-control)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)
- [Author](#author)

## Overview

FreelaTrack helps freelancers manage three connected areas of their work:

1. **Clients** — maintain client contact details.
2. **Projects** — record project information, fees, clients, and statuses.
3. **Income and Payments** — record payments and review income-related summaries.

The dashboard summarizes important information, while charts help users understand monthly income and the distribution of project statuses.

## Problem Statement

Freelancers may use different documents or spreadsheets to store client details, track project progress, and calculate payments. Keeping this information separately can make it difficult to identify active projects, follow up on unpaid amounts, and understand income trends. FreelaTrack brings these activities together in one web application.

## Objectives

- Provide user registration and login.
- Protect user-specific information using authentication.
- Allow users to create, view, update, and delete client records.
- Allow users to manage projects and their statuses.
- Record income and payments.
- Display dashboard summaries for projects and finances.
- Provide search and filtering for project records.
- Visualize income and project status using charts.
- Validate user input and display useful error messages.
- Provide a responsive interface for different screen sizes.

## Key Features

### 1. Authentication
- User registration and login.
- Password hashing using `bcryptjs` (confirm the package name used in your source code).
- JSON Web Token (JWT) authentication.
- Protected backend routes and user-specific data access.

### 2. Dashboard
- Summary of active projects.
- Total recorded income.
- Pending payment information, where supported by the current implementation.
- Charts for monthly income and/or project status.

### 3. Client Management
- Add a client.
- View saved clients.
- Edit client information.
- Delete a client.
- Validate required fields before saving.

### 4. Project Management
- Add projects with a project name, client, status, and fee.
- Edit project details.
- Delete projects.
- Search projects and filter by status or client.

### 5. Income and Payments
- Record payments against projects.
- View payment history.
- Review income totals and related dashboard information.

### 6. Responsive User Interface
- Layout adapts to desktop and smaller screens.
- Navigation and forms are designed to make common tasks easy to find.

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React | Builds the interactive user interface |
| Frontend tooling | Vite | Runs the development server and builds the frontend |
| Charts | Recharts (if present in the repository) | Displays income and project-status charts |
| Backend | Node.js | Runs JavaScript on the server |
| Backend framework | Express.js | Defines REST API routes and middleware |
| Database | MongoDB | Stores application records |
| ODM | Mongoose | Defines schemas and communicates with MongoDB |
| Authentication | JSON Web Token (JWT) | Authenticates requests to protected endpoints |
| Password security | bcrypt / bcryptjs | Hashes passwords before storage |
| Version control | Git and GitHub | Tracks changes and hosts the repository |

Remove or update any technology in this table that is not used in your final implementation.

## Application Architecture

FreelaTrack follows a client-server architecture:

1. The user interacts with the React frontend.
2. The frontend sends HTTP requests to the Express backend.
3. The backend validates incoming data and checks authentication when required.
4. Mongoose communicates with MongoDB to read or update records.
5. The backend returns a JSON response.
6. The frontend updates the page and displays success messages, validation errors, or API errors.

**Request flow:**

`User → React/Vite Frontend → Express REST API → Mongoose → MongoDB`

## Project Structure

The exact folders may differ in your repository. A common structure for this project is:

```text
FreelaTrack/
├── client/                 # React + Vite frontend (folder may be named frontend)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   └── ...
│   ├── package.json
│   └── .env                # Local environment variables (do not commit secrets)
├── server/                 # Node.js + Express backend (folder may be named backend)
│   ├── models/             # Mongoose models
│   ├── routes/             # REST API routes
│   ├── middleware/         # Authentication and other middleware
│   ├── ...
│   ├── package.json
│   └── .env                # Local environment variables (do not commit secrets)
└── README.md
```

Update this tree so it matches the actual names and structure in your repository.

## Prerequisites

Install the following before running the project:

- Node.js (a current LTS release is recommended).
- npm (included with Node.js).
- MongoDB local server or a MongoDB Atlas database.
- Git.
- A modern web browser.

Check installations:

```bash
node --version
npm --version
git --version
```

## Installation and Setup

The commands below are a template. Use the correct folder names and scripts from your actual `package.json` files.

### 1. Clone the repository

```bash
git clone <YOUR_PUBLIC_GITHUB_REPOSITORY_URL>
cd <YOUR_REPOSITORY_FOLDER>
```

### 2. Install backend dependencies

Open a terminal in the backend folder (for example, `server` or `backend`):

```bash
npm install
```

Create a `.env` file in the backend folder and configure the variables listed in [Environment Variables](#environment-variables).

Start the backend using the script defined in that folder's `package.json`. Common examples are:

```bash
npm run dev
```

or:

```bash
npm start
```

Do not use a command unless that script exists in your project.

### 3. Install frontend dependencies

Open another terminal in the frontend folder (for example, `client` or `frontend`):

```bash
npm install
```

Create the frontend `.env` file if your app requires one, then start the frontend:

```bash
npm run dev
```

Vite usually prints a local address such as `http://localhost:5173`. Open the exact address shown in your terminal.

### 4. Connect MongoDB

- For local MongoDB, make sure the MongoDB service is running.
- For MongoDB Atlas, create a database user and allow access from the machine running the application.
- Put the connection string in the backend environment file.
- Never commit credentials, JWT secrets, or other private values to GitHub.

### 5. Verify the application

- Confirm that the backend starts without errors.
- Confirm that the database connection succeeds.
- Open the frontend in a browser.
- Register an account and test the main features.
- Check that API and database errors are handled clearly.

## Environment Variables

Use the variable names expected by your source code. The following are examples only; do not assume they match your implementation.

### Backend `.env` example

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/freelatrack
JWT_SECRET=replace_with_a_long_random_secret
NODE_ENV=development
```

If your backend uses `MONGO_URI`, `JWT_SECRET_KEY`, or another name, use the exact name expected by the code.

### Frontend `.env` example

```env
VITE_API_URL=http://localhost:5000
```

Only include this variable if the frontend reads `import.meta.env.VITE_API_URL`. Some projects use a different variable name or a fixed API configuration.

**Security:** Do not publish real `.env` files or production credentials. Add `.env` to `.gitignore` and provide a safe `.env.example` file with placeholder values.

## Using FreelaTrack

1. **Register:** Create a user account with valid information.
2. **Log in:** Sign in with the registered credentials.
3. **Open the dashboard:** Review project and income summaries.
4. **Manage clients:** Add a client and update or delete the record when needed.
5. **Manage projects:** Create a project, select its client, enter the fee, and set its status.
6. **Search and filter:** Find projects using available search, status, or client filters.
7. **Record payments:** Add a payment using the available income/payment form.
8. **Review charts:** Use the charts to understand recorded income or project-status distribution.
9. **Log out:** End the authenticated session using the logout control.

Exact button labels and behavior may differ based on the current UI.

## API Overview

The backend exposes REST endpoints for authentication, clients, projects, and payments. The exact paths and HTTP methods must be checked in the source code.

| Resource | Typical operations | Purpose |
|---|---|---|
| Authentication | Register / Login | Create an account and obtain authentication |
| Clients | GET / POST / PUT or PATCH / DELETE | Manage client records |
| Projects | GET / POST / PUT or PATCH / DELETE | Manage project records |
| Payments | GET / POST / PUT or PATCH / DELETE, if implemented | Track payment records |
| Dashboard | GET summary endpoint, if implemented | Retrieve dashboard statistics |

This table is a conceptual overview, not a guarantee of the exact route paths. Replace it with the actual endpoints from your backend before submission. Do not document endpoints that are not implemented.

## Security and Validation

The application is intended to use the following practices where implemented:

- Hash passwords rather than storing plain-text passwords.
- Issue and verify JWTs for protected requests.
- Validate required fields and data types.
- Handle invalid login details and rejected API requests.
- Restrict records so one user cannot access another user's private data.
- Keep database credentials and JWT secrets in environment variables.
- Avoid committing `.env` files to the public repository.

## Screenshots

Add screenshots captured from your actual running application. Suggested screenshots:

### Login / Registration
`![Login and registration](docs/screenshots/auth.png)`

### Dashboard
`![FreelaTrack dashboard](docs/screenshots/dashboard.png)`

### Client Management
`![Client management](docs/screenshots/clients.png)`

### Project Management
`![Project management](docs/screenshots/projects.png)`

### Income and Payments
`![Income and payments](docs/screenshots/income.png)`

### Charts and Responsive Layout
`![Income and project charts](docs/screenshots/charts.png)`

Create the `docs/screenshots/` directory and place the matching image files there, or update the image paths to match your repository. Do not leave broken image links in the final README.

## Testing Checklist

Before submission, test the following manually:

- [ ] A new user can register.
- [ ] A registered user can log in with correct credentials.
- [ ] Invalid credentials show an appropriate error.
- [ ] Protected pages or API routes reject unauthenticated requests.
- [ ] A client can be added, edited, displayed, and deleted.
- [ ] A project can be added, edited, displayed, and deleted.
- [ ] Project search and filters work.
- [ ] Payment records can be created and displayed.
- [ ] Dashboard figures reflect the saved data.
- [ ] Charts display the expected information.
- [ ] Invalid form values are handled clearly.
- [ ] The interface works at desktop and mobile widths.
- [ ] One user cannot access another user's records.
- [ ] The application can be started using the README instructions.

Mark a checklist item only after testing it.

## Version Control

The project uses Git for version control and GitHub for repository hosting.

Example commands:

```bash
git status
git add .
git commit -m "Describe the changes made"
git push
```

The assignment requires regular commits. Keep the repository public for assessment, but never commit credentials, tokens, database passwords, or real `.env` files.

## Known Limitations

Document any unfinished features or known issues here. If there are no known limitations after testing, replace this section with a brief statement that the main features were tested in your environment. Do not claim a feature is complete if it does not work.

## Future Improvements

Potential improvements include:

- Pagination for project and payment history.
- Exporting income reports or invoices to CSV/PDF.
- Date-range filters and more detailed reports.
- Automated unit and integration tests.
- Deployment to a public hosting platform.
- Improved accessibility and additional responsive refinements.

These are possible future enhancements and should not be presented as existing features unless they have been implemented.

## Author

**Nadula Hatharasinghe**

- GitHub Repository: `https://github.com/Nadulahatharasinghe/FreelaTrack

- Demo Video: `https://drive.google.com/file/d/1ICY01bJeWYMV0BprA5FX0iRYNH2aa3Nx/view?usp=sharing

