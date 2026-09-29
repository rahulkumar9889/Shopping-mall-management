package com.mall.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "officers")
public class Officer implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 50)
    private String department;

    @Column(name = "assigned_floor", nullable = false)
    private Integer assignedFloor;

    @Column(length = 20)
    private String phone;

    public Officer() {}

    public Officer(User user, String department, Integer assignedFloor, String phone) {
        this.user = user;
        this.department = department;
        this.assignedFloor = assignedFloor;
        this.phone = phone;
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getAssignedFloor() {
        return assignedFloor;
    }

    public void setAssignedFloor(Integer assignedFloor) {
        this.assignedFloor = assignedFloor;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
