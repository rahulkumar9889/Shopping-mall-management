# NexusMall - Shopping Mall Management System

A comprehensive, full-stack web application designed to automate and streamline the operations of a commercial shopping mall. Built as a BCA Final-Year Project, this system provides distinct portals for Administrators, Floor Officers, and Tenants to manage leases, billing, and daily operations efficiently.

## 📖 Project Overview

The **Shopping Mall Management System** replaces traditional, manual paperwork with a centralized digital platform. It handles everything from tenant registration and lease allocation to monthly billing and role-based dashboard access. 

The application is built using **Java Spring Boot** for the backend and **Thymeleaf** for server-side rendering, ensuring a secure, fast, and reliable experience.

## ✨ Key Features

### 👑 Admin Dashboard (Executive Administration)
*   **Real-time Analytics:** View total commercial units, occupancy rates, vacant spaces, and total monthly revenue.
*   **Tenant Directory:** Search, filter, and manage all allocated shop leases (e.g., Zara, Apple Reseller).
*   **Officer Management:** Assign and monitor Floor Supervisory Officers.
*   **Billing Overview:** Track recent mall invoices (Paid, Pending, Overdue).

### 🛡️ Officer Dashboard (Floor Supervisor)
*   **Floor-Specific View:** Officers only see tenants and shops assigned to their specific floor (e.g., Floor 2).
*   **Operations & Safety:** Manage day-to-day floor operations.

### 🏪 Tenant Portal
*   **Lease Details:** View active contract values and lease windows.
*   **Billing History:** Track monthly rent invoices and payment statuses.

### 🔐 Security & Authentication
*   **Role-Based Access Control (RBAC):** Secure login for Admin, Officer, and Tenant roles.
*   **Spring Security 6:** BCrypt password hashing for maximum security.
*   **Custom Success Handler:** Automatically redirects users to their specific dashboard upon login.

## 🛠️ Technology Stack

*   **Backend:** Java 17, Spring Boot 3.2.5
*   **Security:** Spring Security 6 (BCrypt, Custom Authentication)
*   **Database:** H2 In-Memory Database (with `data.sql` seeding)
*   **ORM:** Spring Data JPA, Hibernate
*   **Frontend:** Thymeleaf (HTML5, CSS3, Tailwind CSS)
*   **Build Tool:** Maven
*   **IDE:** VS Code / IntelliJ IDEA

## 🔑 Default Login Credentials

The system comes pre-seeded with the following accounts for testing and evaluation:

| Role | Username | Password | Redirects To |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | `/admin/dashboard` |
| **Officer** | `officer1` | `officer123` | `/officer/dashboard` |
| **Tenant 1** | `tenant1` | `tenant123` | `/tenant/dashboard` (Shop 101 - Zara) |
| **Tenant 2** | `tenant2` | `tenant123` | `/tenant/dashboard` (Shop 204 - Apple) |

## 🚀 How to Run Locally

### Prerequisites
*   Java 17 or higher installed.
*   Maven installed.

### Steps
1. Clone or download this repository.
2. Open a terminal in the root project folder (where `pom.xml` is located).
3. Run the following command:
   ```bash
   mvn clean spring-boot:run
