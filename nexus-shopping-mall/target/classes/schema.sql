-- ===================================================================
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
);

-- Indexes for performance
CREATE INDEX idx_tenant_status ON tenants(status);
CREATE INDEX idx_tenant_category ON tenants(category);
CREATE INDEX idx_bill_status ON bills(status);
CREATE INDEX idx_officer_floor ON officers(assigned_floor);
