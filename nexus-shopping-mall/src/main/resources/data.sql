-- Initial Seed Data for Mall System (Passwords verified with Spring Security BCryptPasswordEncoder)
-- Credentials:
-- admin / admin123
-- officer1 / officer123
-- tenant1 / tenant123
-- tenant2 / tenant123

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
(4, 2, 'November 2026', 12500.00, 'OVERDUE', NULL);
