# 📝 Task Management System

![Status](https://img.shields.io/badge/Status-Deployed-success)
![Frontend](https://img.shields.io/badge/Frontend-Next.js-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js-green)

A full-stack Task Management System designed to help users efficiently organize, track, and manage their daily activities and workflows. 

## 🌐 Live Demo & Deployment

Both the Frontend and Backend are successfully deployed and currently live on Render. You can access the live environments here:

- **Frontend Application:** [https://assignment-1-v627.onrender.com/](https://assignment-1-v627.onrender.com/)
- **Backend API:** [https://assignment-jlkw.onrender.com/](https://assignment-jlkw.onrender.com/)

*(Note: The backend API is hosted on Render's free tier, so it may take ~50 seconds to spin up on the first request if it has been inactive).*

---

## 📄 Business Requirements Document (BRD) Summary

### 1. Objective
To provide a streamlined, user-friendly platform that allows individuals or teams to manage tasks securely. The system incorporates authentication, task CRUD operations, and status tracking to improve overall productivity.

### 2. Core Features
- **User Authentication:** Secure Sign up and Login functionalities.
- **Task Management (CRUD):** 
  - **Create:** Add new tasks with titles, descriptions, and priorities.
  - **Read:** View a list of all assigned tasks and single-task details.
  - **Update:** Edit existing tasks and change their statuses (e.g., Pending, In Progress, Completed).
  - **Delete:** Remove tasks that are no longer needed.
- **Responsive UI:** Seamless experience across desktop and mobile devices.

---

## 💻 Tech Stack Details

### Frontend 
- **Framework:** Next.js / React 
- **Styling:** CSS / TailwindCSS
- **Deployment:** Render
- **Responsibilities:** Managing UI components, handling user interactions, communicating securely with the backend API via HTTP requests, and maintaining client-side state.

### Backend 
- **Framework:** Node.js with Express.js
- **Database:** MongoDB (or PostgreSQL/MySQL, depending on implementation)
- **Deployment:** Render
- **Responsibilities:** Exposing RESTful API endpoints, managing database transactions, handling user authentication and token validation, and enforcing core business logic.

---

## 🚀 Getting Started (Local Development)

If you'd like to run this project locally, follow the instructions below.

### Prerequisites
- [Node.js](https://nodejs.org/en/)
- Git

### 1. Backend Setup
```bash
git clone <your-repository-url>
cd Task-management-System/Backend

# Install dependencies
npm install

# Create a .env file and configure environment variables
# PORT=5000
# DB_URI=your_database_connection_string
# JWT_SECRET=your_secret_key

# Start the server
npm run dev
```

### 2. Frontend Setup
```bash
cd Task-management-System/Frontend

# Install dependencies
npm install

# Create a .env.local file for frontend variables mapped to the backend API
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Start the frontend development server
npm run dev
```

## 📞 Expected API Endpoints

| Method | Endpoint        | Description           |
|--------|-----------------|-----------------------|
| POST   | `/api/login`    | User Login            |
| POST   | `/api/register` | User Registration     |
| GET    | `/api/tasks`    | Fetch all tasks       |
| POST   | `/api/tasks`    | Create a new task     |
| PUT    | `/api/tasks/:id`| Update an existing task |
| DELETE | `/api/tasks/:id`| Delete a task         |
