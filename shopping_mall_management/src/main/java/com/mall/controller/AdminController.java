package com.mall.controller;

import com.mall.model.*;
import com.mall.service.MallService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final MallService mallService;

    public AdminController(MallService mallService) {
        this.mallService = mallService;
    }

    @GetMapping("/dashboard")
    public String dashboard(@RequestParam(value = "category", required = false) String category,
                            Model model) {
        MallInfo mall = mallService.getMallInfo();
        long totalShops = mallService.getTotalShops();
        long occupiedShops = mallService.getOccupiedShops();
        long vacantUnits = mallService.getVacantUnits();
        BigDecimal totalMonthlyRevenue = mallService.getTotalMonthlyRevenue();
        double occupancyRate = mallService.getOccupancyRate();

        List<Tenant> tenants = mallService.getTenantsByCategory(category);
        List<Officer> officers = mallService.getAllOfficers();
        List<Bill> recentBills = mallService.getRecentBills();

        model.addAttribute("mall", mall);
        model.addAttribute("totalShops", totalShops);
        model.addAttribute("occupiedShops", occupiedShops);
        model.addAttribute("vacantUnits", vacantUnits);
        model.addAttribute("totalMonthlyRevenue", totalMonthlyRevenue);
        model.addAttribute("occupancyRate", occupancyRate);
        model.addAttribute("tenants", tenants);
        model.addAttribute("officers", officers);
        model.addAttribute("recentBills", recentBills);
        model.addAttribute("selectedCategory", category);

        return "admin/dashboard";
    }

    @PostMapping("/tenants/add")
    public String addTenant(@RequestParam("username") String username,
                            @RequestParam("password") String password,
                            @RequestParam("fullName") String fullName,
                            @RequestParam("email") String email,
                            @RequestParam("shopNumber") String shopNumber,
                            @RequestParam("businessName") String businessName,
                            @RequestParam("category") String category,
                            @RequestParam("monthlyRent") BigDecimal monthlyRent,
                            @RequestParam("leaseStart") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate leaseStart,
                            @RequestParam("leaseEnd") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate leaseEnd,
                            RedirectAttributes redirectAttributes) {
        try {
            mallService.createTenant(username, password, fullName, email, shopNumber, businessName, category, monthlyRent, leaseStart, leaseEnd);
            redirectAttributes.addFlashAttribute("successMessage", "Tenant '" + businessName + "' registered successfully!");
        } catch (Exception ex) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to register tenant: " + ex.getMessage());
        }
        return "redirect:/admin/dashboard";
    }

    @PostMapping("/tenants/edit")
    public String editTenant(@RequestParam("id") Long id,
                             @RequestParam("businessName") String businessName,
                             @RequestParam("category") String category,
                             @RequestParam("monthlyRent") BigDecimal monthlyRent,
                             @RequestParam("status") TenantStatus status,
                             RedirectAttributes redirectAttributes) {
        try {
            mallService.updateTenant(id, businessName, category, monthlyRent, status);
            redirectAttributes.addFlashAttribute("successMessage", "Tenant '" + businessName + "' updated successfully!");
        } catch (Exception ex) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to update tenant: " + ex.getMessage());
        }
        return "redirect:/admin/dashboard";
    }

    @PostMapping("/tenants/delete/{id}")
    public String deleteTenant(@PathVariable("id") Long id, RedirectAttributes redirectAttributes) {
        try {
            mallService.deleteTenant(id);
            redirectAttributes.addFlashAttribute("successMessage", "Tenant unit removed successfully.");
        } catch (Exception ex) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to delete tenant: " + ex.getMessage());
        }
        return "redirect:/admin/dashboard";
    }

    @PostMapping("/officers/assign")
    public String assignOfficer(@RequestParam("username") String username,
                                @RequestParam("fullName") String fullName,
                                @RequestParam("email") String email,
                                @RequestParam("department") String department,
                                @RequestParam("assignedFloor") Integer assignedFloor,
                                @RequestParam("phone") String phone,
                                RedirectAttributes redirectAttributes) {
        try {
            mallService.assignOfficer(username, fullName, email, department, assignedFloor, phone);
            redirectAttributes.addFlashAttribute("successMessage", "Officer '" + fullName + "' assigned to Floor " + assignedFloor + "!");
        } catch (Exception ex) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to assign officer: " + ex.getMessage());
        }
        return "redirect:/admin/dashboard";
    }
}
