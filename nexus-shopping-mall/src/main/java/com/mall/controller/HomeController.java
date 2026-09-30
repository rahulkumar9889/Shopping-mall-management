package com.mall.controller;

import com.mall.model.MallInfo;
import com.mall.model.Tenant;
import com.mall.service.MallService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class HomeController {

    private final MallService mallService;

    public HomeController(MallService mallService) {
        this.mallService = mallService;
    }

    @GetMapping({"/", "/home"})
    public String home(Model model) {
        try {
            MallInfo mallInfo = mallService.getMallInfo();
            List<Tenant> tenants = mallService.getAllTenants();
            model.addAttribute("mall", mallInfo);
            model.addAttribute("tenants", tenants);
            model.addAttribute("totalShops", mallService.getTotalShops());
            model.addAttribute("occupiedShops", mallService.getOccupiedShops());
            model.addAttribute("vacantUnits", mallService.getVacantUnits());
        } catch (Exception ex) {
            // Safe fallback during bootstrap
        }
        return "home";
    }
}
