**🚀 AstroTrack**

AstroTrack is a full-stack astronomy observation platform that allows users to record celestial observations, share community posts, and explore astronomy-related information through a modern web application.

##🌟 Features
*User Registration & Login
*JWT Authentication & Authorization
*Secure Password Encryption using BCrypt
*Create and Manage Astronomy Observations
*Community Viewing & Observation Log Sharing
*NASA API Integration
*PostgreSQL Cloud Database (Neon)
*Responsive React Frontend
*RESTful API Architecture
*Deployed Backend & Frontend


##🛠 Tech Stack

###Frontend ;
React
Vite
CSS

###Backend ;
Java 17
Spring Boot
Spring Security
Spring Data JPA
JWT Authentication

###Database ;
PostgreSQL (Neon)

###Deployment ;
Render (Backend)
Vercel (Frontend)

## 📂 Project Structure

```text
AstroTrack/
│
├── astrotrack-ui/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ObservationCard.jsx
│   │   │   └── CommunityPost.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Observations.jsx
│   │   │   └── Community.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── backend/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/astrotrack/
│   │   │   │
│   │   │   │── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── ObservationController.java
│   │   │   │   ├── CommunityController.java
│   │   │   │   └── NasaController.java
│   │   │   │
│   │   │   ├── service/
│   │   │   │   ├── ObservationService.java
│   │   │   │   └── NasaService.java
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java
│   │   │   │   └── ObservationRepository.java
│   │   │   │
│   │   │   ├── model/
│   │   │   │   ├── User.java
│   │   │   │   ├── Observation.java
│   │   │   │   └── CommunityPost.java
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── AuthRequest.java
│   │   │   │   └── AuthResponse.java
│   │   │   │
│   │   │   ├── security/
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── JwtUtil.java
│   │   │   │   └── JwtRequestFilter.java
│   │   │   │
│   │   │   └── AstroTrackApplication.java
│   │   │
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── pom.xml
│
├── .gitignore
├── README.md
└── LICENSE
```


##🔐 Key Implementations
*Stateless JWT Authentication
*BCrypt Password Hashing
*CORS Configuration
*REST API Development
*PostgreSQL Cloud Integration
*Secure User Management

##🚀 Live Demo

Frontend: [Your Vercel URL]

Backend API: [Your Render URL]



###👨‍💻 Author
Dheeshi/Java Full Stack Developer
GitHub: https://github.com/dheeshi
