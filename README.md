# 🚀 AstroTrack

A full-stack astronomy observation platform built with **Java Spring Boot**, **React**, and **PostgreSQL**.


## ✨ Features

### 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- BCrypt Password Encryption

### 🌌 Astronomy Observations
- Create Observation Logs
- View Observation History
- Store Observation Details
- Edit/Delete Observation

### 👥 Community Features
- Create Community Posts
- View Shared Posts
  
### 🚀 NASA Integration
- NASA API Integration
- Astronomy Data Retrieval

### ☁️ Cloud Deployment
- PostgreSQL Database (Neon)
- Backend Deployment (Render)
- Frontend Deployment (Vercel)

---

## 🛠 Tech Stack

| Category | Technology |
|-----------|------------|
| Frontend | React, Vite |
| Backend | Spring Boot |
| Security | Spring Security, JWT |
| Database | PostgreSQL (Neon) |
| ORM | Spring Data JPA |
| Deployment | Render, Vercel |

---

## 📂 Project Structure

```text
AstroTrack/
│
├── astrotrack-ui/          # React Frontend
│
├── backend/                # Spring Boot Backend
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   ├── dto/
│   ├── security/
│   └── resources/
│
├── README.md
└── .gitignore
```

---

## 🔑 API Modules

1. Authentication API
   - Register User
   - Login User

2. Observation API
   - Add Observation
   - View Observations
   - Edit Observation
   - Delete Observation

3. Community API
   - Create Post
   - View Posts

4. NASA API
   - Fetch Astronomy Data

---

## 🗄 Database

The application currently uses two primary tables:

1. Users
   - Stores authentication data
   - Passwords encrypted using BCrypt

2. Observations
   - Stores astronomy observation logs
   - Linked to registered users

---

## 📷 Screenshots

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/6a922a2a-40db-477d-b052-653dd004d101" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/aa0c2866-29f3-44e5-bee5-93a6a3320364" />

---

## 👨‍💻 Author

**Dheeshith M**

Java Full Stack Developer

GitHub: https://github.com/dheeshi

---

⭐ Built to demonstrate Full Stack Development, Spring Security, JWT Authentication, PostgreSQL Integration, REST APIs, and Cloud Deployment.
