# 🚀 TrackSphere - Role-Based Bug Tracking System

TrackSphere is a full-stack **Bug Tracking System** developed using **Spring Boot, React, MySQL, JWT Authentication, and Spring Security**. It provides a secure and efficient platform for managing software bugs through role-based access control.

The application simulates a real-world software development workflow where **Administrators**, **Developers**, and **Testers** collaborate to manage projects and resolve bugs.

---

# 🌐 Live Demo

### Frontend

https://front-end-z6qf.onrender.com/

### Backend API

https://tracksphere-rqr5.onrender.com

---

# 📌 Features

## Authentication

* Secure JWT Authentication
* BCrypt Password Encryption
* Role-Based Authorization
* Protected REST APIs
* Persistent Login using JWT Token

---

# 👥 User Roles

## 👑 Administrator

* Login
* Create Projects
* View All Projects
* Delete Projects
* Register Developers
* Register Testers
* View All Bugs
* Assign Bugs to Developers
* Monitor Bug Progress
* View Admin Dashboard

---

## 👨‍💻 Developer

* Login
* View Assigned Bugs
* Update Bug Status
* Add Comments
* View Personal Dashboard

---

## 🧪 Tester

* Login
* Report New Bugs
* View Reported Bugs
* Add Comments
* View Personal Dashboard

---

# 📊 Dashboard

### Admin Dashboard

* Total Projects
* Total Bugs
* Open Bugs
* In Progress Bugs
* Resolved Bugs
* Closed Bugs
* Total Developers
* Total Testers

---

### Developer Dashboard

* Assigned Bugs
* Open Tasks
* In Progress Tasks
* Resolved Tasks
* Closed Tasks

---

### Tester Dashboard

* Reported Bugs
* Open Reports
* In Progress Reports
* Resolved Reports
* Closed Reports

---

# 🛠 Technology Stack

## Backend

* Java 17
* Spring Boot 3
* Spring Security
* Spring Data JPA
* Hibernate
* Maven
* JWT
* Lombok

---

## Frontend

* React.js
* JavaScript
* HTML5
* CSS3

---

## Database

* MySQL
* Aiven Cloud MySQL

---

## Deployment

* Render (Backend)
* Render (Frontend)
* Docker
* GitHub

---

# 🏗 Project Architecture

```
                    React Frontend
                           │
                           │ REST API
                           ▼
                  Spring Boot Backend
                           │
                 Spring Security + JWT
                           │
                           ▼
                     MySQL (Aiven)
```

---

# 📂 Project Structure

```
TrackSphere

├── Back-End
│   ├── src
│   ├── pom.xml
│   ├── Dockerfile
│   └── application.properties
│
└── Front-End
    ├── src
    ├── public
    ├── package.json
    └── README.md
```

---

# 🔐 Security

* JWT Authentication
* BCrypt Password Hashing
* Role-Based Access Control
* Stateless Authentication
* Protected APIs using Spring Security

---

# 🗄 Database Tables

* users
* project
* bug
* comment

---

# 📡 REST APIs

## Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/login    |
| POST   | /api/auth/register |

---

## Dashboard

| Method | Endpoint                 |
| ------ | ------------------------ |
| GET    | /api/dashboard/admin     |
| GET    | /api/dashboard/developer |
| GET    | /api/dashboard/tester    |

---

## Projects

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | /api/projects/getall |
| POST   | /api/projects/create |
| GET    | /api/projects/{id}   |
| DELETE | /api/projects/{id}   |

---

## Bugs

| Method | Endpoint                            |
| ------ | ----------------------------------- |
| POST   | /api/bugs/create                    |
| GET    | /api/bugs/getall                    |
| GET    | /api/bugs/{id}                      |
| GET    | /api/bugs/my-bugs                   |
| GET    | /api/bugs/my-reported-bugs          |
| PUT    | /api/bugs/{id}/assign/{developerId} |
| PUT    | /api/bugs/{id}/status               |
| GET    | /api/bugs/status                    |
| GET    | /api/bugs/priority                  |

---

## Comments

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | /api/comments/add     |
| GET    | /api/comments/{bugId} |

---

# 💻 Local Setup

## Clone Repository

```bash
git clone https://github.com/your-username/TrackSphere.git
```

```
cd TrackSphere
```

---

## Backend

```
cd Back-End
```

Create environment variables:

```
DB_URL

DB_USERNAME

DB_PASSWORD

JWT_SECRET
```

Run

```
mvn spring-boot:run
```

Backend

```
http://localhost:8080
```

---

## Frontend

```
cd Front-End
```

Install packages

```
npm install
```

Create

```
.env
```

Add

```
REACT_APP_API_BASE=http://localhost:8080
```

Run

```
npm start
```

Frontend

```
http://localhost:3000
```

---

# 🌍 Deployment

Backend

* Docker
* Render Web Service

Frontend

* Render Static Site

Database

* Aiven MySQL Cloud

---

# 🎯 Demo Credentials

> Registration is intentionally disabled to simulate an enterprise application.
> New users can only be created by an Administrator.

## Administrator

Email

```
admin@tracksphere.com
```

Password

```
Admin@123
```

---

## Developer

Email

```
developer@tracksphere.com
```

Password

```
Developer@123
```

---

## Tester

Email

```
tester@tracksphere.com
```

Password

```
Tester@123
```

---

# 🚀 Future Enhancements

* File Attachments
* Email Notifications
* Forgot Password
* Activity Timeline
* Audit Logs
* Search & Pagination
* Bug Analytics
* WebSocket Notifications
* Docker Compose
* CI/CD Pipeline
* Kubernetes Deployment

---

# 📸 Screenshots

Add screenshots for:

* Login Page
  <img width="1918" height="878" alt="image" src="https://github.com/user-attachments/assets/a0208561-584a-4205-ade4-1585aee6c1d6" />

* Admin Dashboard
  <img width="1918" height="872" alt="image" src="https://github.com/user-attachments/assets/a5678f5f-2099-4155-ab2a-8f288cd71f8c" />
  <img width="1918" height="880" alt="image" src="https://github.com/user-attachments/assets/9639f06d-2ddc-477d-b934-79102f0c617f" />
  <img width="1918" height="872" alt="image" src="https://github.com/user-attachments/assets/89485714-c6fc-4b75-b758-3254c859ece0" />
  <img width="1918" height="877" alt="image" src="https://github.com/user-attachments/assets/69144903-484f-44ea-8e33-c0a47eef0bc7" />

  <img width="1918" height="875" alt="image" src="https://github.com/user-attachments/assets/f1e65af6-512c-4df3-bca1-3557a51388a9" />


* Developer Dashboard
  <img width="1918" height="876" alt="image" src="https://github.com/user-attachments/assets/a615bf59-09ea-402e-b2a0-a9131b5fb8e9" />
  <img width="1913" height="873" alt="image" src="https://github.com/user-attachments/assets/ee9d7db8-9069-4595-a923-abfcb4a59305" />
  <img width="1918" height="881" alt="image" src="https://github.com/user-attachments/assets/ffeef5dd-1929-43b5-8632-1d7283379cd8" />

* Tester Dashboard
  <img width="1912" height="877" alt="image" src="https://github.com/user-attachments/assets/c8f8fb6b-7c0d-44e7-b2d6-62d0e3e0c8b1" />
  <img width="1918" height="881" alt="image" src="https://github.com/user-attachments/assets/8a927a26-f284-4a00-8532-57a71f736473" />
  <img width="1918" height="867" alt="image" src="https://github.com/user-attachments/assets/a70863c7-c7ba-4284-9315-38c2e312c692" />

* Comments
  <img width="1917" height="885" alt="image" src="https://github.com/user-attachments/assets/9631e48b-2ccc-488a-bb3d-20d31767591e" />


---

# 👨‍💻 Author

**Charan Raju**

Java Full Stack Developer

GitHub: https://github.com/Charanrajueluri123

---

# ⭐ If you like this project

Please consider giving the repository a **Star ⭐**.
