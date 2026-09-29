package com.mall.config;

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
        System.out.println(">>> Initializing Shopping Mall Management System Seed Data & BCrypt Credentials...");

        // 1. Seed or Update Mall Information
        MallInfo mallInfo = mallInfoRepository.findAll().stream().findFirst()
                .orElseGet(() -> mallInfoRepository.save(new MallInfo("Nexus Grand Galleria Mall", "Metropolis City", 5, 60)));

        // 2. Ensure Admin User with verified BCrypt password
        User adminUser = userRepository.findByUsernameIgnoreCase("admin").orElseGet(User::new);
        adminUser.setUsername("admin");
        adminUser.setPassword(passwordEncoder.encode("admin123"));
        adminUser.setFullName("Mall General Director");
        adminUser.setEmail("admin@nexusmall.com");
        adminUser.setRole(Role.ROLE_ADMIN);
        userRepository.save(adminUser);

        // 3. Ensure Officer User & Officer Profile (officer1 / officer123, Floor 2)
        User officerUser = userRepository.findByUsernameIgnoreCase("officer1").orElseGet(User::new);
        officerUser.setUsername("officer1");
        officerUser.setPassword(passwordEncoder.encode("officer123"));
        officerUser.setFullName("Marcus Sterling");
        officerUser.setEmail("officer1@nexusmall.com");
        officerUser.setRole(Role.ROLE_OFFICER);
        officerUser = userRepository.save(officerUser);

        final User finalOfficerUser = officerUser;
        Officer officer = officerRepository.findByUser(officerUser).orElseGet(() -> 
                new Officer(finalOfficerUser, "Operations & Safety", 2, "+1 (555) 234-8901"));
        officer.setDepartment("Operations & Safety");
        officer.setAssignedFloor(2);
        officer.setPhone("+1 (555) 234-8901");
        officerRepository.save(officer);

        // 4. Ensure Tenant 1 (tenant1 / tenant123, Shop 101 - Zara Premier Outlet)
        User tenant1User = userRepository.findByUsernameIgnoreCase("tenant1").orElseGet(User::new);
        tenant1User.setUsername("tenant1");
        tenant1User.setPassword(passwordEncoder.encode("tenant123"));
        tenant1User.setFullName("Elena Rostova");
        tenant1User.setEmail("contact@zarafashion.com");
        tenant1User.setRole(Role.ROLE_TENANT);
        tenant1User = userRepository.save(tenant1User);

        final User finalTenant1User = tenant1User;
        Tenant tenant1 = tenantRepository.findByUser(tenant1User).orElseGet(() -> 
                new Tenant(finalTenant1User, "Shop 101", "Zara Premier Outlet", "Fashion & Apparel",
                        new BigDecimal("8500.00"), LocalDate.of(2024, 1, 1), LocalDate.of(2027, 12, 31), TenantStatus.ACTIVE));
        tenantRepository.save(tenant1);

        // 5. Ensure Tenant 2 (tenant2 / tenant123, Shop 204 - Apple Authorized Reseller)
        User tenant2User = userRepository.findByUsernameIgnoreCase("tenant2").orElseGet(User::new);
        tenant2User.setUsername("tenant2");
        tenant2User.setPassword(passwordEncoder.encode("tenant123"));
        tenant2User.setFullName("David Chen");
        tenant2User.setEmail("support@applepremium.com");
        tenant2User.setRole(Role.ROLE_TENANT);
        tenant2User = userRepository.save(tenant2User);

        final User finalTenant2User = tenant2User;
        Tenant tenant2 = tenantRepository.findByUser(tenant2User).orElseGet(() -> 
                new Tenant(finalTenant2User, "Shop 204", "Apple Authorized Reseller", "Electronics",
                        new BigDecimal("12500.00"), LocalDate.of(2023, 6, 1), LocalDate.of(2026, 5, 31), TenantStatus.ACTIVE));
        tenantRepository.save(tenant2);

        // 6. Ensure Bills exist
        if (billRepository.count() == 0) {
            billRepository.save(new Bill(
                    tenant1,
                    "October 2026",
                    new BigDecimal("8500.00"),
                    BillStatus.PAID,
                    LocalDate.of(2026, 10, 2)
            ));
            billRepository.save(new Bill(
                    tenant1,
                    "November 2026",
                    new BigDecimal("8500.00"),
                    BillStatus.PENDING,
                    null
            ));
            billRepository.save(new Bill(
                    tenant2,
                    "October 2026",
                    new BigDecimal("12500.00"),
                    BillStatus.PAID,
                    LocalDate.of(2026, 10, 1)
            ));
            billRepository.save(new Bill(
                    tenant2,
                    "November 2026",
                    new BigDecimal("12500.00"),
                    BillStatus.OVERDUE,
                    null
            ));
        }

        System.out.println(">>> Seed Data & BCrypt Credentials Verified Successfully for SMMS!");
    }
}
