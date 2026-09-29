package com.mall.repository;

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
}
