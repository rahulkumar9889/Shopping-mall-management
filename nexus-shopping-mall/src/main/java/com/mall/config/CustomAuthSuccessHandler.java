package com.mall.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;

@Component
public class CustomAuthSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String redirectUrl = "/admin/dashboard";

        for (GrantedAuthority authority : authorities) {
            String role = authority.getAuthority();
            if (role.equalsIgnoreCase("ROLE_ADMIN") || role.equalsIgnoreCase("ADMIN")) {
                redirectUrl = "/admin/dashboard";
                break;
            } else if (role.equalsIgnoreCase("ROLE_OFFICER") || role.equalsIgnoreCase("OFFICER")) {
                redirectUrl = "/officer/dashboard";
                break;
            } else if (role.equalsIgnoreCase("ROLE_TENANT") || role.equalsIgnoreCase("TENANT")) {
                redirectUrl = "/tenant/dashboard";
                break;
            }
        }

        response.sendRedirect(redirectUrl);
    }
}
