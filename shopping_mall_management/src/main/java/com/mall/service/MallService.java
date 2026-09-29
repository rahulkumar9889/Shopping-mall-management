package com.mall.service;

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

    // Mall Property Info
    public MallInfo getMallInfo() {
        return mallInfoRepository.findAll().stream().findFirst()
                .orElseGet(() -> mallInfoRepository.save(new MallInfo("Nexus Grand Galleria Mall", "Metropolis City", 5, 60)));
    }

    // Dashboard Metrics
    public long getTotalShops() {
        return getMallInfo().getTotalUnits();
    }

    public long getOccupiedShops() {
        return tenantRepository.countActiveTenants();
    }

    public long getVacantUnits() {
        long total = getTotalShops();
        long occupied = getOccupiedShops();
        return Math.max(0, total - occupied);
    }

    public BigDecimal getTotalMonthlyRevenue() {
        return tenantRepository.sumActiveMonthlyRent();
    }

    public double getOccupancyRate() {
        long total = getTotalShops();
        if (total == 0) return 0.0;
        double rate = ((double) getOccupiedShops() / total) * 100.0;
        return BigDecimal.valueOf(rate).setScale(1, RoundingMode.HALF_UP).doubleValue();
    }

    // Tenant Management
    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }

    public List<Tenant> getTenantsByCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            return getAllTenants();
        }
        return tenantRepository.findByCategory(category);
    }

    public Optional<Tenant> getTenantById(Long id) {
        return tenantRepository.findById(id);
    }

    public Optional<Tenant> getTenantByUsername(String username) {
        return tenantRepository.findByUser_Username(username);
    }

    public Tenant createTenant(String username, String rawPassword, String fullName, String email,
                               String shopNumber, String businessName, String category,
                               BigDecimal monthlyRent, LocalDate leaseStart, LocalDate leaseEnd) {
        
        // 1. Create User
        User user = new User(
                username,
                passwordEncoder.encode(rawPassword),
                fullName,
                email,
                Role.ROLE_TENANT
        );
        user = userRepository.save(user);

        // 2. Create Tenant
        Tenant tenant = new Tenant(
                user,
                shopNumber,
                businessName,
                category,
                monthlyRent,
                leaseStart,
                leaseEnd,
                TenantStatus.ACTIVE
        );
        tenant = tenantRepository.save(tenant);

        // 3. Create initial pending bill
        String currentMonth = LocalDate.now().getMonth().name() + " " + LocalDate.now().getYear();
        Bill bill = new Bill(tenant, currentMonth, monthlyRent, BillStatus.PENDING, null);
        billRepository.save(bill);

        return tenant;
    }

    public Tenant updateTenant(Long id, String businessName, String category, BigDecimal monthlyRent, TenantStatus status) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tenant not found with ID: " + id));

        tenant.setBusinessName(businessName);
        tenant.setCategory(category);
        tenant.setMonthlyRent(monthlyRent);
        tenant.setStatus(status);

        return tenantRepository.save(tenant);
    }

    public void deleteTenant(Long id) {
        tenantRepository.deleteById(id);
    }

    // Officer Management
    public List<Officer> getAllOfficers() {
        return officerRepository.findAll();
    }

    public Optional<Officer> getOfficerByUsername(String username) {
        return officerRepository.findByUser_Username(username);
    }

    public Officer assignOfficer(String username, String fullName, String email,
                                 String department, Integer assignedFloor, String phone) {
        
        User user = userRepository.findByUsername(username).orElseGet(() -> {
            User newUser = new User(username, passwordEncoder.encode("officer123"), fullName, email, Role.ROLE_OFFICER);
            return userRepository.save(newUser);
        });

        Officer officer = officerRepository.findByUser(user).orElseGet(() -> new Officer(user, department, assignedFloor, phone));
        officer.setDepartment(department);
        officer.setAssignedFloor(assignedFloor);
        officer.setPhone(phone);

        return officerRepository.save(officer);
    }

    // Floor-Based Filtering (e.g. Floor 2 matches Shop 2xx or assigned floor)
    public List<Tenant> getActiveTenantsOnFloor(Integer floor) {
        String floorPrefix = "Shop " + floor;
        return tenantRepository.findAll().stream()
                .filter(t -> t.getStatus() == TenantStatus.ACTIVE)
                .filter(t -> t.getShopNumber() != null && t.getShopNumber().startsWith(floorPrefix))
                .collect(Collectors.toList());
    }

    // Billing Management
    public List<Bill> getBillsForTenant(Tenant tenant) {
        return billRepository.findByTenantOrderByBillingMonthDesc(tenant);
    }

    public List<Bill> getRecentBills() {
        return billRepository.findTop10ByOrderByIdDesc();
    }

    public Bill payRent(Long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + billId));

        bill.setStatus(BillStatus.PAID);
        bill.setPaymentDate(LocalDate.now());
        return billRepository.save(bill);
    }
}
