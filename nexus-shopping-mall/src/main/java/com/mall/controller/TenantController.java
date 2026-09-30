package com.mall.controller;

import com.mall.model.Bill;
import com.mall.model.Tenant;
import com.mall.service.MallService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/tenant")
public class TenantController {

    private final MallService mallService;

    public TenantController(MallService mallService) {
        this.mallService = mallService;
    }

    @GetMapping("/dashboard")
    public String dashboard(Authentication authentication, Model model) {
        String username = authentication != null ? authentication.getName() : "tenant1";

        Tenant tenant = mallService.getTenantByUsername(username)
                .orElseGet(() -> {
                    List<Tenant> all = mallService.getAllTenants();
                    return all.isEmpty() ? null : all.get(0);
                });

        if (tenant == null) {
            model.addAttribute("errorMessage", "No active tenant profile linked to this account.");
            return "error";
        }

        List<Bill> bills = mallService.getBillsForTenant(tenant);

        model.addAttribute("tenant", tenant);
        model.addAttribute("bills", bills);

        return "tenant/dashboard";
    }

    @PostMapping("/pay-rent/{billId}")
    public String payRent(@PathVariable("billId") Long billId, RedirectAttributes redirectAttributes) {
        try {
            mallService.payRent(billId);
            redirectAttributes.addFlashAttribute("successMessage", "Payment processed successfully! Your lease ledger has been updated to PAID.");
        } catch (Exception ex) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to process payment: " + ex.getMessage());
        }
        return "redirect:/tenant/dashboard";
    }
}
