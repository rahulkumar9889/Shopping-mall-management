# Nexus Grand Galleria Mall — Shopping Mall Management System

**BCA Final-Year Academic Project**

A full-stack Shopping Mall Management System built with **Java Spring Boot 3**, **Spring Security 6**, **Spring Data JPA**, **Hibernate**, **H2 Database**, and **Thymeleaf**.

---

## 📌 Project Overview

Nexus Grand Galleria Mall is a web-based management system designed to handle the day-to-day operations of a commercial shopping mall. It provides role-based dashboards for Administrators, Floor Officers, and Tenants, allowing them to manage store leases, billing, floor operations, and tenant records efficiently.

The system replaces manual paperwork with a centralized digital platform, reducing errors and improving operational efficiency.

---

## ✨ Key Features

### Public Portal
- **Homepage:** Modern dark-themed landing page with hero section, mall statistics, and featured boutiques.
- **Store Directory:** Browse all active stores with category filters (Fashion, Electronics, Dining, Beauty, Luxury, Watches).
- **Interactive Floor Map:** View unit distribution across all 5 architectural levels.
- **Flagship Showcase:** Highlight premium anchor stores like Zara, Apple, Gucci, and Rolex.
- **Dining, Events, Offers & Amenities Sections:** Informational sections for mall visitors.

### Role-Based Dashboards
- **Admin Dashboard:** 
  - View total commercial units (60), occupancy rate, vacant units, and monthly revenue.
  - Manage tenant directory and lease agreements.
  - Generate and track mall invoices (Paid, Pending, Overdue).
- **Officer Dashboard:** 
  - Floor-specific operations and safety management.
  - View assigned floor, department, and contact details.
- **Tenant Dashboard:** 
  - View lease details, shop unit, and monthly rent.
  - Check invoice history and payment status.

### Security & Authentication
- Spring Security 6 with form-based authentication.
- BCrypt password hashing (strength 10).
- Custom role-based success handler redirecting users to their respective dashboards.
- Case-insensitive username lookup with whitespace trimming.

---

## 🔐 Default Test Credentials

Use the following credentials to log in and test the system:

| Role | Username | Password | Redirects To |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | `/admin/dashboard` |
| **Officer** | `officer1` | `officer123` | `/officer/dashboard` (Floor 2) |
| **Tenant 1** | `tenant1` | `tenant123` | `/tenant/dashboard` (Shop 101 — Zara) |
| **Tenant 2** | `tenant2` | `tenant123` | `/tenant/dashboard` (Shop 204 — Apple) |

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Java 17, Spring Boot 3.2.5 |
| **Security** | Spring Security 6 (BCrypt, Role-Based Access) |
| **Persistence** | Spring Data JPA, Hibernate |
| **Database** | H2 (In-Memory for local, File-Based for persistence) |
| **Frontend** | Thymeleaf, HTML5, CSS3, JavaScript |
| **Build Tool** | Apache Maven |
| **Deployment** | Ngrok (Live Tunneling), Render (Cloud Hosting) |

---

## 🚀 How to Run Locally

### Prerequisites
- Java 17 or higher installed
- Apache Maven installed
- Internet connection (for first-time dependency download)

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/nexusmall.git
   cd nexusmall