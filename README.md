# 🚇 Integrated Metro Management Platform

A comprehensive **Metro Transit Management and Booking Platform** built using **Spring Boot**. The system is designed to manage metro cities, lines, stations, routes, trains, schedules, users, bookings, tickets, payments, and QR-based ticketing.

The project follows a layered backend architecture with REST APIs and relational database management.

---

## 📌 Project Overview

The Integrated Metro Management Platform is designed to simulate a real-world metro transportation management system.

The platform manages the complete journey from:

**Metro Network Management → Route & Train Scheduling → User Booking → Payment → Digital Ticket → QR Code**

The system is being developed with scalability and modularity in mind so that additional cities, metro lines, stations, and services can be added in the future.

---

## 🚀 Key Features

### 🏙️ City Management
- Create cities
- View cities
- Update city information
- Delete cities
- Support multiple metro lines within a city

### 🟣 Line Management
- Create metro lines
- Store line names and colors
- Update lines
- Delete lines
- Associate stations with metro lines

### 🚉 Station Management
- Add stations
- Update station information
- Delete stations
- View all stations
- Associate stations with metro routes

### 🛤️ Route Management
- Create routes
- Define ordered stations within routes
- Store distance between consecutive stations
- Store estimated travel time
- Activate/deactivate routes

### 🚆 Train Management
- Add trains
- Assign train numbers
- Store coach count
- Activate/deactivate trains

### 📅 Schedule Management
- Assign trains to routes
- Define departure time
- Define arrival time
- Define fare
- Activate/deactivate schedules

### 👤 User Management
- User registration
- User information management
- Email and phone uniqueness
- User roles
- Account timestamps

### 🎫 Booking Management
- Create bookings
- Associate bookings with users
- Associate bookings with schedules
- Passenger count
- Fare calculation
- Booking status management

### 🎟️ Digital Ticketing
- Generate tickets after successful booking
- Generate unique QR codes
- Store QR code files using MinIO
- QR-based ticket verification

### 💳 Payment
- Payment processing
- Payment status tracking
- Booking-payment relationship
- Payment confirmation before ticket generation

### 📦 Object Storage

**MinIO** is used for storing generated QR code images.

Example:

```text
MinIO
└── metro-tickets/
    ├── ticket-1001.png
    ├── ticket-1002.png
    └── ticket-1003.png
