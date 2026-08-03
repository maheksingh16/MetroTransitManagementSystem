# Metro Booking System 🚇

A full-stack Metro Booking System built using Spring Boot, PostgreSQL, React, JWT Authentication, and MinIO.

The system allows users to register, log in, search metro schedules, book tickets, receive QR-based tickets, and validate tickets during metro entry/check-in.

---

## 🚀 Features

### Authentication & Authorization
- User registration
- User login
- JWT-based authentication
- Password encryption using BCrypt
- Role-based users
- Protected API endpoints

### Metro Management
- Station management
- Metro line management
- Train management
- Schedule management

### Booking & Ticketing
- Book metro journeys
- Calculate total fare
- Generate booking/ticket information
- 24-hour ticket validity
- Ticket status management
- QR code generation
- QR image storage using MinIO

### Ticket Validation
- QR-based ticket verification
- Check-in validation
- Prevent reuse of already checked-in tickets
- Validate ticket expiry
- Ticket lifecycle management

### Additional
- PostgreSQL database
- REST APIs
- Exception handling
- Backend/frontend integration

---

## 🛠️ Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- Hibernate
- Lombok

### Database
- PostgreSQL

### Storage
- MinIO
- Used for storing generated QR ticket images

### Frontend
- React
- Vite
- JavaScript
- CSS

---

## 📁 Backend Structure

```text
src/
└── main/
    └── java/
        └── com.example.metrobookingsystem/
            ├── Controller/
            ├── Service/
            ├── Repository/
            ├── Entity/
            ├── Security/
            ├── Exception/
            └── MetrobookingsystemApplication.java
