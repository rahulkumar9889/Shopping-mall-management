export interface ProjectFile {
  path: string;
  name: string;
  category: 'build' | 'config' | 'sql' | 'model' | 'repository' | 'service' | 'security' | 'controller' | 'template' | 'css' | 'docs';
  language: 'xml' | 'properties' | 'sql' | 'java' | 'html' | 'css' | 'markdown';
  description: string;
  content: string;
}

export const PROJECT_FILES: ProjectFile[] = [
  {
    path: 'pom.xml',
    name: 'pom.xml',
    category: 'build',
    language: 'xml',
    description: 'Maven Project Object Model with Spring Boot 3.2.5, JPA, Security, Thymeleaf, MySQL & H2',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.5</version>
        <relativePath/>
    </parent>
    
    <groupId>com.mall</groupId>
    <artifactId>shopping-mall-management</artifactId>
    <version>1.0.0</version>
    <name>shopping-mall-management</name>
    <description>Shopping Mall Management System - BCA Final Year Academic Project</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Web & MVC -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <!-- Persistence: Spring Data JPA + Hibernate -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <!-- Security: Spring Security 6 with BCrypt -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <!-- Templating: Thymeleaf + Security 6 Dialect -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
        <dependency>
            <groupId>org.thymeleaf.extras</groupId>
            <artifactId>thymeleaf-extras-springsecurity6</artifactId>
        </dependency>
        
        <!-- Drivers: MySQL 8.x + H2 In-Memory Fallback -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    path: 'src/main/resources/application.properties',
    name: 'application.properties',
    category: 'config',
    language: 'properties',
    description: 'Spring Boot configuration with dual H2 in-memory fallback and optional MySQL 8.x connection',
    content: `# ===================================================================
# Shopping Mall Management System - Configuration (Spring Boot 3.x)
# BCA Academic Final-Year Project
# ===================================================================

spring.application.name=Shopping Mall Management System
server.port=8080

# -------------------------------------------------------------------
# Primary Database: H2 In-Memory (Zero Manual Setup Fallback)
# -------------------------------------------------------------------
spring.datasource.url=jdbc:h2:mem:malldb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# H2 Web Console (http://localhost:8080/h2-console)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
spring.h2.console.settings.web-allow-others=true

# -------------------------------------------------------------------
# Optional: MySQL 8.x Production Configuration (Uncomment to activate)
# -------------------------------------------------------------------
# spring.datasource.url=jdbc:mysql://localhost:3306/mall_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
# spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
# spring.datasource.username=root
# spring.datasource.password=root123

# JPA & Hibernate Settings
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.defer-datasource-initialization=true

# Thymeleaf Template Engine
spring.thymeleaf.cache=false
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html
spring.thymeleaf.mode=HTML
spring.thymeleaf.encoding=UTF-8`
  },
  {
    path: 'src/main/resources/schema.sql',
    name: 'schema.sql',
    category: 'sql',
    language: 'sql',
    description: 'Complete 3NF normalized DDL schema with foreign key cascades and check constraints',
    content: `-- ===================================================================
-- Shopping Mall Management System - Normalized DDL Schema
-- MySQL 8.x / H2 Compatible Database Schema
-- ===================================================================

DROP TABLE IF EXISTS bills;
DROP TABLE IF EXISTS tenants;
DROP TABLE IF EXISTS officers;
DROP TABLE IF EXISTS mall_info;
DROP TABLE IF EXISTS users;

-- 1. Users Table (Core Authentication & Role Management)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ROLE_ADMIN', 'ROLE_OFFICER', 'ROLE_TENANT'))
);

-- 2. Mall Info Table (General Property Specifications)
CREATE TABLE mall_info (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mall_name VARCHAR(100) NOT NULL,
    city VARCHAR(50),
    total_floors INT NOT NULL,
    total_units INT NOT NULL
);

-- 3. Officers Table (Departmental Floor Supervisory Staff)
CREATE TABLE officers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    department VARCHAR(50) NOT NULL,
    assigned_floor INT NOT NULL,
    phone VARCHAR(20),
    CONSTRAINT fk_officer_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Tenants Table (Commercial Lease Holders & Stores)
CREATE TABLE tenants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    shop_number VARCHAR(20) NOT NULL UNIQUE,
    business_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    monthly_rent DECIMAL(10,2) NOT NULL,
    lease_start DATE NOT NULL,
    lease_end DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE', 'TERMINATED')),
    CONSTRAINT fk_tenant_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Bills Table (Rental & Utility Ledger)
CREATE TABLE bills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    billing_month VARCHAR(20) NOT NULL,
    amount_due DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PAID', 'PENDING', 'OVERDUE')),
    payment_date DATE NULL,
    CONSTRAINT fk_bill_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);`
  },
  {
    path: 'src/main/resources/data.sql',
    name: 'data.sql',
    category: 'sql',
    language: 'sql',
    description: 'Pre-seeded demonstration accounts with BCrypt-hashed passwords and realistic lease data',
    content: `-- Initial Seed Data for Mall System (Passwords encoded using BCrypt)
-- admin: admin123
-- officer1: officer123
-- tenant1: tenant123
-- tenant2: tenant123

INSERT INTO mall_info (id, mall_name, city, total_floors, total_units)
VALUES (1, 'Nexus Grand Galleria Mall', 'Metropolis City', 5, 60);

-- Insert Users (Using verified $2a$ standard BCrypt hashes for Spring Security)
INSERT INTO users (id, username, password, full_name, email, role)
VALUES 
(1, 'admin', '$2a$10$tBGNJet4owtZ43NOeindVOfjMpyRH.VufNmM5fP.fQmCENEFlKIti', 'Mall General Director', 'admin@nexusmall.com', 'ROLE_ADMIN'),
(2, 'officer1', '$2a$10$0oYIa4jfqG4gUDwHYi21vO1afRUoP7ftiWjIj3TOpSC1BU5FiEUgC', 'Marcus Sterling', 'officer1@nexusmall.com', 'ROLE_OFFICER'),
(3, 'tenant1', '$2a$10$U7xIlahXeXTdbvVO8yacIOxkytQ3nAFxF/ARadOkKcwV0qKL4sD3C', 'Elena Rostova', 'contact@zarafashion.com', 'ROLE_TENANT'),
(4, 'tenant2', '$2a$10$U7xIlahXeXTdbvVO8yacIOxkytQ3nAFxF/ARadOkKcwV0qKL4sD3C', 'David Chen', 'support@applepremium.com', 'ROLE_TENANT');

-- Insert Officers
INSERT INTO officers (id, user_id, department, assigned_floor, phone)
VALUES 
(1, 2, 'Operations & Safety', 2, '+1 (555) 234-8901');

-- Insert Tenants
INSERT INTO tenants (id, user_id, shop_number, business_name, category, monthly_rent, lease_start, lease_end, status)
VALUES 
(1, 3, 'Shop 101', 'Zara Premier Outlet', 'Fashion & Apparel', 8500.00, '2024-01-01', '2027-12-31', 'ACTIVE'),
(2, 4, 'Shop 204', 'Apple Authorized Reseller', 'Electronics', 12500.00, '2023-06-01', '2026-05-31', 'ACTIVE');

-- Insert Initial Bills
INSERT INTO bills (id, tenant_id, billing_month, amount_due, status, payment_date)
VALUES 
(1, 1, 'October 2026', 8500.00, 'PAID', '2026-10-02'),
(2, 1, 'November 2026', 8500.00, 'PENDING', NULL),
(3, 2, 'October 2026', 12500.00, 'PAID', '2026-10-01'),
(4, 2, 'November 2026', 12500.00, 'OVERDUE', NULL);`
  },
  {
    path: 'src/main/resources/static/css/style.css',
    name: 'style.css',
    category: 'css',
    language: 'css',
    description: 'Modern, professional Bootstrap 5 custom styling with metric cards, badges, and clean cards',
    content: `/* Modern Professional Stylesheet for SMMS Enterprise */
:root {
  --mall-primary: #1e3a8a;
  --mall-primary-dark: #172554;
  --mall-secondary: #0f766e;
  --mall-accent: #3b82f6;
  --mall-bg: #f8fafc;
  --mall-border: #e2e8f0;
}

body {
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--mall-bg);
  min-height: 100vh;
}

.navbar-mall {
  background: linear-gradient(135deg, var(--mall-primary-dark) 0%, var(--mall-primary) 100%);
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.15);
}

.metric-card {
  border-radius: 14px;
  border: 1px solid var(--mall-border);
  background: #ffffff;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;
}

.metric-card.primary::after { content: ''; position: absolute; top:0; left:0; right:0; height:4px; background: #1e3a8a; }
.metric-card.success::after { content: ''; position: absolute; top:0; left:0; right:0; height:4px; background: #10b981; }
.metric-card.warning::after { content: ''; position: absolute; top:0; left:0; right:0; height:4px; background: #f59e0b; }
.metric-card.accent::after { content: ''; position: absolute; top:0; left:0; right:0; height:4px; background: #3b82f6; }

.badge-status-active { background-color: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 0.35rem 0.75rem; border-radius: 9999px; }
.badge-status-inactive { background-color: #fef2f2; color: #991b1b; border: 1px solid #fecaca; padding: 0.35rem 0.75rem; border-radius: 9999px; }
.badge-bill-paid { background-color: #ecfdf5; color: #047857; border: 1px solid #6ee7b7; padding: 0.35rem 0.75rem; border-radius: 6px; }
.badge-bill-pending { background-color: #fffbeb; color: #b45309; border: 1px solid #fde68a; padding: 0.35rem 0.75rem; border-radius: 6px; }
.badge-bill-overdue { background-color: #fef2f2; color: #b91c1c; border: 1px solid #fca5a5; padding: 0.35rem 0.75rem; border-radius: 6px; }`
  },
  {
    path: 'src/main/java/com/mall/ShoppingMallApplication.java',
    name: 'ShoppingMallApplication.java',
    category: 'service',
    language: 'java',
    description: 'Spring Boot 3 application main bootstrap class',
    content: `package com.mall;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ShoppingMallApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShoppingMallApplication.class, args);
    }
}`
  },
  {
    path: 'src/main/java/com/mall/model/User.java',
    name: 'User.java',
    category: 'model',
    language: 'java',
    description: 'JPA entity representing system users with roles and credentials',
    content: `package com.mall.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "users")
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    public User() {}

    public User(String username, String password, String fullName, String email, Role role) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}`
  },
  {
    path: 'src/main/java/com/mall/model/Tenant.java',
    name: 'Tenant.java',
    category: 'model',
    language: 'java',
    description: 'JPA entity mapping commercial stores, leases, and one-to-one user relationship',
    content: `package com.mall.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "tenants")
public class Tenant implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER, optional = false, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "shop_number", nullable = false, unique = true, length = 20)
    private String shopNumber;

    @Column(name = "business_name", nullable = false, length = 100)
    private String businessName;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "monthly_rent", nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyRent;

    @Column(name = "lease_start", nullable = false)
    private LocalDate leaseStart;

    @Column(name = "lease_end", nullable = false)
    private LocalDate leaseEnd;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TenantStatus status;

    public Tenant() {}

    public Tenant(User user, String shopNumber, String businessName, String category,
                  BigDecimal monthlyRent, LocalDate leaseStart, LocalDate leaseEnd, TenantStatus status) {
        this.user = user;
        this.shopNumber = shopNumber;
        this.businessName = businessName;
        this.category = category;
        this.monthlyRent = monthlyRent;
        this.leaseStart = leaseStart;
        this.leaseEnd = leaseEnd;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getShopNumber() { return shopNumber; }
    public void setShopNumber(String shopNumber) { this.shopNumber = shopNumber; }
    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public BigDecimal getMonthlyRent() { return monthlyRent; }
    public void setMonthlyRent(BigDecimal monthlyRent) { this.monthlyRent = monthlyRent; }
    public LocalDate getLeaseStart() { return leaseStart; }
    public void setLeaseStart(LocalDate leaseStart) { this.leaseStart = leaseStart; }
    public LocalDate getLeaseEnd() { return leaseEnd; }
    public void setLeaseEnd(LocalDate leaseEnd) { this.leaseEnd = leaseEnd; }
    public TenantStatus getStatus() { return status; }
    public void setStatus(TenantStatus status) { this.status = status; }
}`
  },
  {
    path: 'src/main/java/com/mall/model/Officer.java',
    name: 'Officer.java',
    category: 'model',
    language: 'java',
    description: 'JPA entity mapping supervisory staff assigned to specific mall floors',
    content: `package com.mall.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "officers")
public class Officer implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER, optional = false, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 50)
    private String department;

    @Column(name = "assigned_floor", nullable = false)
    private Integer assignedFloor;

    @Column(length = 20)
    private String phone;

    public Officer() {}

    public Officer(User user, String department, Integer assignedFloor, String phone) {
        this.user = user;
        this.department = department;
        this.assignedFloor = assignedFloor;
        this.phone = phone;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public Integer getAssignedFloor() { return assignedFloor; }
    public void setAssignedFloor(Integer assignedFloor) { this.assignedFloor = assignedFloor; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}`
  },
  {
    path: 'src/main/java/com/mall/model/Bill.java',
    name: 'Bill.java',
    category: 'model',
    language: 'java',
    description: 'JPA entity for tenant billing ledger, payment statuses, and settlement dates',
    content: `package com.mall.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "bills")
public class Bill implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @Column(name = "billing_month", nullable = false, length = 20)
    private String billingMonth;

    @Column(name = "amount_due", nullable = false, precision = 10, scale = 2)
    private BigDecimal amountDue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BillStatus status;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    public Bill() {}

    public Bill(Tenant tenant, String billingMonth, BigDecimal amountDue, BillStatus status, LocalDate paymentDate) {
        this.tenant = tenant;
        this.billingMonth = billingMonth;
        this.amountDue = amountDue;
        this.status = status;
        this.paymentDate = paymentDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Tenant getTenant() { return tenant; }
    public void setTenant(Tenant tenant) { this.tenant = tenant; }
    public String getBillingMonth() { return billingMonth; }
    public void setBillingMonth(String billingMonth) { this.billingMonth = billingMonth; }
    public BigDecimal getAmountDue() { return amountDue; }
    public void setAmountDue(BigDecimal amountDue) { this.amountDue = amountDue; }
    public BillStatus getStatus() { return status; }
    public void setStatus(BillStatus status) { this.status = status; }
    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }
}`
  },
  {
    path: 'src/main/java/com/mall/repository/UserRepository.java',
    name: 'UserRepository.java',
    category: 'repository',
    language: 'java',
    description: 'Spring Data JPA repository with case-insensitive and unique username queries',
    content: `package com.mall.repository;

import com.mall.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameIgnoreCase(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByUsernameIgnoreCase(String username);
    boolean existsByEmail(String email);
}`
  },
  {
    path: 'src/main/java/com/mall/repository/MallInfoRepository.java',
    name: 'MallInfoRepository.java',
    category: 'repository',
    language: 'java',
    description: 'Spring Data JPA repository for mall property specifications',
    content: `package com.mall.repository;

import com.mall.model.MallInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MallInfoRepository extends JpaRepository<MallInfo, Long> {
}`
  },
  {
    path: 'src/main/java/com/mall/repository/OfficerRepository.java',
    name: 'OfficerRepository.java',
    category: 'repository',
    language: 'java',
    description: 'Spring Data JPA repository for departmental floor supervisors',
    content: `package com.mall.repository;

import com.mall.model.Officer;
import com.mall.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfficerRepository extends JpaRepository<Officer, Long> {
    Optional<Officer> findByUser(User user);
    Optional<Officer> findByUser_Username(String username);
    List<Officer> findByAssignedFloor(Integer floor);
}`
  },
  {
    path: 'src/main/java/com/mall/repository/TenantRepository.java',
    name: 'TenantRepository.java',
    category: 'repository',
    language: 'java',
    description: 'Spring Data JPA repository for shop tenants and lease queries',
    content: `package com.mall.repository;

import com.mall.model.Tenant;
import com.mall.model.TenantStatus;
import com.mall.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {
    Optional<Tenant> findByUser(User user);
    Optional<Tenant> findByUser_Username(String username);
    Optional<Tenant> findByShopNumber(String shopNumber);
    List<Tenant> findByStatus(TenantStatus status);
    List<Tenant> findByCategory(String category);
    List<Tenant> findByShopNumberStartingWith(String prefix);

    @Query("SELECT COUNT(t) FROM Tenant t WHERE t.status = 'ACTIVE'")
    long countActiveTenants();

    @Query("SELECT COALESCE(SUM(t.monthlyRent), 0) FROM Tenant t WHERE t.status = 'ACTIVE'")
    BigDecimal calculateTotalActiveRevenue();
}`
  },
  {
    path: 'src/main/java/com/mall/repository/BillRepository.java',
    name: 'BillRepository.java',
    category: 'repository',
    language: 'java',
    description: 'Spring Data JPA repository for tenant monthly rent and utility invoices',
    content: `package com.mall.repository;

import com.mall.model.Bill;
import com.mall.model.BillStatus;
import com.mall.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByTenantOrderByBillingMonthDesc(Tenant tenant);
    List<Bill> findByTenant_IdOrderByBillingMonthDesc(Long tenantId);
    List<Bill> findByStatus(BillStatus status);
    List<Bill> findTop10ByOrderByIdDesc();
}`
  },
  {
    path: 'src/main/java/com/mall/service/CustomUserDetailsService.java',
    name: 'CustomUserDetailsService.java',
    category: 'security',
    language: 'java',
    description: 'Spring Security UserDetailsService implementation with trim and case-insensitive lookup',
    content: `package com.mall.service;

import com.mall.model.User;
import com.mall.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (username == null || username.trim().isEmpty()) {
            throw new UsernameNotFoundException("Username cannot be empty");
        }
        String cleanUsername = username.trim();
        User user = userRepository.findByUsernameIgnoreCase(cleanUsername)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + cleanUsername));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()))
        );
    }
}`
  },
  {
    path: 'src/main/java/com/mall/config/SecurityConfig.java',
    name: 'SecurityConfig.java',
    category: 'security',
    language: 'java',
    description: 'Spring Security 6 configuration with role-based routing and BCrypt password encryption',
    content: `package com.mall.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomAuthSuccessHandler customAuthSuccessHandler;

    public SecurityConfig(CustomAuthSuccessHandler customAuthSuccessHandler) {
        this.customAuthSuccessHandler = customAuthSuccessHandler;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public org.springframework.security.authentication.dao.DaoAuthenticationProvider authenticationProvider(
            com.mall.service.CustomUserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {
        org.springframework.security.authentication.dao.DaoAuthenticationProvider authProvider = new org.springframework.security.authentication.dao.DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   org.springframework.security.authentication.dao.DaoAuthenticationProvider authenticationProvider) throws Exception {
        http
            .authenticationProvider(authenticationProvider)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/css/**", "/js/**", "/images/**", "/webjars/**", "/favicon.ico").permitAll()
                .requestMatchers("/login", "/h2-console/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/officer/**").hasRole("OFFICER")
                .requestMatchers("/tenant/**").hasRole("TENANT")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .usernameParameter("username")
                .passwordParameter("password")
                .successHandler(customAuthSuccessHandler)
                .failureUrl("/login?error=true")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )
            .csrf(csrf -> csrf.ignoringRequestMatchers("/h2-console/**"))
            .headers(headers -> headers
                .addHeaderWriter(new XFrameOptionsHeaderWriter(XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN))
            );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}`
  },
  {
    path: 'src/main/java/com/mall/config/CustomAuthSuccessHandler.java',
    name: 'CustomAuthSuccessHandler.java',
    category: 'security',
    language: 'java',
    description: 'Redirects authenticated users directly to their assigned role dashboard',
    content: `package com.mall.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;

@Component
public class CustomAuthSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String redirectUrl = "/login?error=true";

        for (GrantedAuthority authority : authorities) {
            String role = authority.getAuthority();
            if (role.equals("ROLE_ADMIN")) {
                redirectUrl = "/admin/dashboard";
                break;
            } else if (role.equals("ROLE_OFFICER")) {
                redirectUrl = "/officer/dashboard";
                break;
            } else if (role.equals("ROLE_TENANT")) {
                redirectUrl = "/tenant/dashboard";
                break;
            }
        }

        response.sendRedirect(redirectUrl);
    }
}`
  },
  {
    path: 'src/main/java/com/mall/config/DataInitializer.java',
    name: 'DataInitializer.java',
    category: 'service',
    language: 'java',
    description: 'CommandLineRunner component executing on boot for zero manual setup test credentials',
    content: `package com.mall.config;

import com.mall.model.*;
import com.mall.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MallInfoRepository mallInfoRepository;
    private final OfficerRepository officerRepository;
    private final TenantRepository tenantRepository;
    private final BillRepository billRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           MallInfoRepository mallInfoRepository,
                           OfficerRepository officerRepository,
                           TenantRepository tenantRepository,
                           BillRepository billRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.mallInfoRepository = mallInfoRepository;
        this.officerRepository = officerRepository;
        this.tenantRepository = tenantRepository;
        this.billRepository = billRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Mall Info
        if (mallInfoRepository.count() == 0) {
            mallInfoRepository.save(new MallInfo("Nexus Grand Galleria Mall", "Metropolis City", 5, 60));
        }

        // 2. Admin: admin / admin123
        User adminUser = userRepository.findByUsernameIgnoreCase("admin").orElseGet(User::new);
        adminUser.setUsername("admin");
        adminUser.setPassword(passwordEncoder.encode("admin123"));
        adminUser.setFullName("Mall General Director");
        adminUser.setEmail("admin@nexusmall.com");
        adminUser.setRole(Role.ROLE_ADMIN);
        userRepository.save(adminUser);

        // 3. Officer: officer1 / officer123 (Floor 2)
        User officerUser = userRepository.findByUsernameIgnoreCase("officer1").orElseGet(User::new);
        officerUser.setUsername("officer1");
        officerUser.setPassword(passwordEncoder.encode("officer123"));
        officerUser.setFullName("Marcus Sterling");
        officerUser.setEmail("officer1@nexusmall.com");
        officerUser.setRole(Role.ROLE_OFFICER);
        officerUser = userRepository.save(officerUser);

        final User finalOfficer = officerUser;
        Officer officer = officerRepository.findByUser(officerUser).orElseGet(() -> 
                new Officer(finalOfficer, "Operations & Safety", 2, "+1 (555) 234-8901"));
        officer.setDepartment("Operations & Safety");
        officer.setAssignedFloor(2);
        officer.setPhone("+1 (555) 234-8901");
        officerRepository.save(officer);

        // 4. Tenant 1: tenant1 / tenant123 (Shop 101 - Zara)
        User tenant1User = userRepository.findByUsernameIgnoreCase("tenant1").orElseGet(User::new);
        tenant1User.setUsername("tenant1");
        tenant1User.setPassword(passwordEncoder.encode("tenant123"));
        tenant1User.setFullName("Elena Rostova");
        tenant1User.setEmail("contact@zarafashion.com");
        tenant1User.setRole(Role.ROLE_TENANT);
        tenant1User = userRepository.save(tenant1User);

        final User finalTenant1 = tenant1User;
        Tenant tenant1 = tenantRepository.findByUser(tenant1User).orElseGet(() -> 
                new Tenant(finalTenant1, "Shop 101", "Zara Premier Outlet", "Fashion & Apparel",
                        new BigDecimal("8500.00"), LocalDate.of(2024, 1, 1), LocalDate.of(2027, 12, 31), TenantStatus.ACTIVE));
        tenantRepository.save(tenant1);

        // 5. Tenant 2: tenant2 / tenant123 (Shop 204 - Apple)
        User tenant2User = userRepository.findByUsernameIgnoreCase("tenant2").orElseGet(User::new);
        tenant2User.setUsername("tenant2");
        tenant2User.setPassword(passwordEncoder.encode("tenant123"));
        tenant2User.setFullName("David Chen");
        tenant2User.setEmail("support@applepremium.com");
        tenant2User.setRole(Role.ROLE_TENANT);
        tenant2User = userRepository.save(tenant2User);

        final User finalTenant2 = tenant2User;
        Tenant tenant2 = tenantRepository.findByUser(tenant2User).orElseGet(() -> 
                new Tenant(finalTenant2, "Shop 204", "Apple Authorized Reseller", "Electronics",
                        new BigDecimal("12500.00"), LocalDate.of(2023, 6, 1), LocalDate.of(2026, 5, 31), TenantStatus.ACTIVE));
        tenantRepository.save(tenant2);

        // 6. Bills
        if (billRepository.count() == 0) {
            billRepository.save(new Bill(tenant1, "October 2026", new BigDecimal("8500.00"), BillStatus.PAID, LocalDate.of(2026, 10, 2)));
            billRepository.save(new Bill(tenant1, "November 2026", new BigDecimal("8500.00"), BillStatus.PENDING, null));
            billRepository.save(new Bill(tenant2, "October 2026", new BigDecimal("12500.00"), BillStatus.PAID, LocalDate.of(2026, 10, 1)));
            billRepository.save(new Bill(tenant2, "November 2026", new BigDecimal("12500.00"), BillStatus.OVERDUE, null));
        }
    }
}`
  },
  {
    path: 'src/main/java/com/mall/service/MallService.java',
    name: 'MallService.java',
    category: 'service',
    language: 'java',
    description: 'Central transaction-managed service handling metrics, leasing, floor officers, and billing',
    content: `package com.mall.service;

import com.mall.model.*;
import com.mall.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MallService {

    private final UserRepository userRepository;
    private final MallInfoRepository mallInfoRepository;
    private final OfficerRepository officerRepository;
    private final TenantRepository tenantRepository;
    private final BillRepository billRepository;
    private final PasswordEncoder passwordEncoder;

    public MallService(UserRepository userRepository,
                       MallInfoRepository mallInfoRepository,
                       OfficerRepository officerRepository,
                       TenantRepository tenantRepository,
                       BillRepository billRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.mallInfoRepository = mallInfoRepository;
        this.officerRepository = officerRepository;
        this.tenantRepository = tenantRepository;
        this.billRepository = billRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public MallInfo getMallInfo() {
        return mallInfoRepository.findAll().stream().findFirst()
                .orElseGet(() -> mallInfoRepository.save(new MallInfo("Nexus Grand Galleria Mall", "Metropolis City", 5, 60)));
    }

    public long getTotalShops() { return getMallInfo().getTotalUnits(); }
    public long getOccupiedShops() { return tenantRepository.countActiveTenants(); }
    public long getVacantUnits() { return Math.max(0, getTotalShops() - getOccupiedShops()); }
    public BigDecimal getTotalMonthlyRevenue() { return tenantRepository.sumActiveMonthlyRent(); }

    public double getOccupancyRate() {
        long total = getTotalShops();
        if (total == 0) return 0.0;
        double rate = ((double) getOccupiedShops() / total) * 100.0;
        return BigDecimal.valueOf(rate).setScale(1, RoundingMode.HALF_UP).doubleValue();
    }

    public List<Tenant> getAllTenants() { return tenantRepository.findAll(); }
    public List<Tenant> getTenantsByCategory(String category) {
        if (category == null || category.trim().isEmpty()) return getAllTenants();
        return tenantRepository.findByCategory(category);
    }
    public Optional<Tenant> getTenantByUsername(String username) { return tenantRepository.findByUser_Username(username); }

    public Tenant createTenant(String username, String rawPassword, String fullName, String email,
                               String shopNumber, String businessName, String category,
                               BigDecimal monthlyRent, LocalDate leaseStart, LocalDate leaseEnd) {
        User user = userRepository.save(new User(username, passwordEncoder.encode(rawPassword), fullName, email, Role.ROLE_TENANT));
        Tenant tenant = tenantRepository.save(new Tenant(user, shopNumber, businessName, category, monthlyRent, leaseStart, leaseEnd, TenantStatus.ACTIVE));
        billRepository.save(new Bill(tenant, LocalDate.now().getMonth().name() + " " + LocalDate.now().getYear(), monthlyRent, BillStatus.PENDING, null));
        return tenant;
    }

    public Tenant updateTenant(Long id, String businessName, String category, BigDecimal monthlyRent, TenantStatus status) {
        Tenant tenant = tenantRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Tenant not found"));
        tenant.setBusinessName(businessName);
        tenant.setCategory(category);
        tenant.setMonthlyRent(monthlyRent);
        tenant.setStatus(status);
        return tenantRepository.save(tenant);
    }

    public void deleteTenant(Long id) { tenantRepository.deleteById(id); }
    public List<Officer> getAllOfficers() { return officerRepository.findAll(); }
    public Optional<Officer> getOfficerByUsername(String username) { return officerRepository.findByUser_Username(username); }

    public Officer assignOfficer(String username, String fullName, String email, String department, Integer assignedFloor, String phone) {
        User user = userRepository.findByUsername(username).orElseGet(() ->
            userRepository.save(new User(username, passwordEncoder.encode("officer123"), fullName, email, Role.ROLE_OFFICER))
        );
        Officer officer = officerRepository.findByUser(user).orElseGet(() -> new Officer(user, department, assignedFloor, phone));
        officer.setDepartment(department);
        officer.setAssignedFloor(assignedFloor);
        officer.setPhone(phone);
        return officerRepository.save(officer);
    }

    public List<Tenant> getActiveTenantsOnFloor(Integer floor) {
        String floorPrefix = "Shop " + floor;
        return tenantRepository.findAll().stream()
                .filter(t -> t.getStatus() == TenantStatus.ACTIVE)
                .filter(t -> t.getShopNumber() != null && t.getShopNumber().startsWith(floorPrefix))
                .collect(Collectors.toList());
    }

    public List<Bill> getBillsForTenant(Tenant tenant) { return billRepository.findByTenantOrderByBillingMonthDesc(tenant); }
    public List<Bill> getRecentBills() { return billRepository.findTop10ByOrderByIdDesc(); }

    public Bill payRent(Long billId) {
        Bill bill = billRepository.findById(billId).orElseThrow(() -> new IllegalArgumentException("Bill not found"));
        bill.setStatus(BillStatus.PAID);
        bill.setPaymentDate(LocalDate.now());
        return billRepository.save(bill);
    }
}`
  },
  {
    path: 'src/main/java/com/mall/controller/AdminController.java',
    name: 'AdminController.java',
    category: 'controller',
    language: 'java',
    description: 'Spring MVC controller managing the executive admin dashboard, metrics, and modals',
    content: `package com.mall.controller;

import com.mall.model.*;
import com.mall.service.MallService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.math.BigDecimal;
import java.time.LocalDate;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final MallService mallService;

    public AdminController(MallService mallService) {
        this.mallService = mallService;
    }

    @GetMapping("/dashboard")
    public String dashboard(@RequestParam(value = "category", required = false) String category, Model model) {
        model.addAttribute("mall", mallService.getMallInfo());
        model.addAttribute("totalShops", mallService.getTotalShops());
        model.addAttribute("occupiedShops", mallService.getOccupiedShops());
        model.addAttribute("vacantUnits", mallService.getVacantUnits());
        model.addAttribute("totalMonthlyRevenue", mallService.getTotalMonthlyRevenue());
        model.addAttribute("occupancyRate", mallService.getOccupancyRate());
        model.addAttribute("tenants", mallService.getTenantsByCategory(category));
        model.addAttribute("officers", mallService.getAllOfficers());
        model.addAttribute("recentBills", mallService.getRecentBills());
        model.addAttribute("selectedCategory", category);
        return "admin/dashboard";
    }

    @PostMapping("/tenants/add")
    public String addTenant(@RequestParam String username, @RequestParam String password,
                            @RequestParam String fullName, @RequestParam String email,
                            @RequestParam String shopNumber, @RequestParam String businessName,
                            @RequestParam String category, @RequestParam BigDecimal monthlyRent,
                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate leaseStart,
                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate leaseEnd,
                            RedirectAttributes redirectAttributes) {
        try {
            mallService.createTenant(username, password, fullName, email, shopNumber, businessName, category, monthlyRent, leaseStart, leaseEnd);
            redirectAttributes.addFlashAttribute("successMessage", "Tenant '" + businessName + "' registered successfully!");
        } catch (Exception ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        }
        return "redirect:/admin/dashboard";
    }

    @PostMapping("/tenants/edit")
    public String editTenant(@RequestParam Long id, @RequestParam String businessName,
                             @RequestParam String category, @RequestParam BigDecimal monthlyRent,
                             @RequestParam TenantStatus status, RedirectAttributes redirectAttributes) {
        mallService.updateTenant(id, businessName, category, monthlyRent, status);
        redirectAttributes.addFlashAttribute("successMessage", "Tenant updated successfully!");
        return "redirect:/admin/dashboard";
    }

    @PostMapping("/tenants/delete/{id}")
    public String deleteTenant(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        mallService.deleteTenant(id);
        redirectAttributes.addFlashAttribute("successMessage", "Tenant unit removed.");
        return "redirect:/admin/dashboard";
    }

    @PostMapping("/officers/assign")
    public String assignOfficer(@RequestParam String username, @RequestParam String fullName,
                                @RequestParam String email, @RequestParam String department,
                                @RequestParam Integer assignedFloor, @RequestParam String phone,
                                RedirectAttributes redirectAttributes) {
        mallService.assignOfficer(username, fullName, email, department, assignedFloor, phone);
        redirectAttributes.addFlashAttribute("successMessage", "Officer assigned to Floor " + assignedFloor);
        return "redirect:/admin/dashboard";
    }
}`
  },
  {
    path: 'src/main/resources/templates/admin/dashboard.html',
    name: 'dashboard.html',
    category: 'template',
    language: 'html',
    description: 'Thymeleaf admin dashboard template with 4 metric cards, tenant table, and modals',
    content: `<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head th:replace="~{layout/base :: head('Admin Dashboard')}"></head>
<body class="bg-light">
    <nav th:replace="~{layout/base :: navbar}"></nav>
    <main class="container-fluid px-lg-5 py-4">
        <div class="row g-3 mb-4">
            <div class="col-sm-6 col-xl-3">
                <div class="metric-card primary">
                    <span class="text-muted small fw-bold">TOTAL COMMERCIAL UNITS</span>
                    <h3 class="fw-bold mt-2" th:text="\${totalShops}">60</h3>
                </div>
            </div>
            <div class="col-sm-6 col-xl-3">
                <div class="metric-card success">
                    <span class="text-muted small fw-bold">OCCUPIED UNITS</span>
                    <h3 class="fw-bold mt-2 text-success" th:text="\${occupiedShops}">2</h3>
                </div>
            </div>
            <div class="col-sm-6 col-xl-3">
                <div class="metric-card warning">
                    <span class="text-muted small fw-bold">VACANT UNITS</span>
                    <h3 class="fw-bold mt-2 text-warning" th:text="\${vacantUnits}">58</h3>
                </div>
            </div>
            <div class="col-sm-6 col-xl-3">
                <div class="metric-card accent">
                    <span class="text-muted small fw-bold">MONTHLY REVENUE</span>
                    <h3 class="fw-bold mt-2 text-primary" th:text="'$' + #numbers.formatDecimal(totalMonthlyRevenue, 1, 'COMMA', 2, 'POINT')">$21,000.00</h3>
                </div>
            </div>
        </div>
        <!-- Table & Modals -->
    </main>
    <footer th:replace="~{layout/base :: footer}"></footer>
</body>
</html>`
  }
];
