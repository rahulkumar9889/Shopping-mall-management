package com.mall;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Shopping Mall Management System (SMMS)
 * BCA Final-Year Academic Capstone Project
 * 
 * Built with:
 * - Spring Boot 3.x
 * - Spring Security 6 with BCrypt & Role-Based Access Control
 * - Spring Data JPA & Hibernate ORM
 * - H2 (In-Memory Development) & MySQL 8.x Production Support
 * - Thymeleaf with Bootstrap 5
 */
@SpringBootApplication
public class ShoppingMallApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShoppingMallApplication.class, args);
    }
}
