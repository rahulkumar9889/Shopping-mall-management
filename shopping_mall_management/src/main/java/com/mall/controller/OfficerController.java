package com.mall.controller;

import com.mall.model.Officer;
import com.mall.model.Tenant;
import com.mall.service.MallService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/officer")
public class OfficerController {

    private final MallService mallService;

    public OfficerController(MallService mallService) {
        this.mallService = mallService;
    }

    @GetMapping("/dashboard")
    public String dashboard(Authentication authentication, Model model) {
        String username = authentication != null ? authentication.getName() : "officer1";
        
        Officer officer = mallService.getOfficerByUsername(username)
                .orElseGet(() -> {
                    // Fallback to first officer if username lookup misses
                    List<Officer> all = mallService.getAllOfficers();
                    return all.isEmpty() ? null : all.get(0);
                });

        if (officer == null) {
            model.addAttribute("errorMessage", "No officer profile assigned to this user.");
            return "error";
        }

        List<Tenant> floorTenants = mallService.getActiveTenantsOnFloor(officer.getAssignedFloor());

        model.addAttribute("officer", officer);
        model.addAttribute("floorTenants", floorTenants);

        return "officer/dashboard";
    }
}
