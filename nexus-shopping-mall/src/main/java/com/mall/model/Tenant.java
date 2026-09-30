package com.mall.model;

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

    @OneToOne(fetch = FetchType.EAGER, optional = false)
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getShopNumber() {
        return shopNumber;
    }

    public void setShopNumber(String shopNumber) {
        this.shopNumber = shopNumber;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getMonthlyRent() {
        return monthlyRent;
    }

    public void setMonthlyRent(BigDecimal monthlyRent) {
        this.monthlyRent = monthlyRent;
    }

    public LocalDate getLeaseStart() {
        return leaseStart;
    }

    public void setLeaseStart(LocalDate leaseStart) {
        this.leaseStart = leaseStart;
    }

    public LocalDate getLeaseEnd() {
        return leaseEnd;
    }

    public void setLeaseEnd(LocalDate leaseEnd) {
        this.leaseEnd = leaseEnd;
    }

    public TenantStatus getStatus() {
        return status;
    }

    public void setStatus(TenantStatus status) {
        this.status = status;
    }
}
