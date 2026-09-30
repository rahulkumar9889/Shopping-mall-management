package com.mall.repository;

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
    BigDecimal sumActiveMonthlyRent();
}
