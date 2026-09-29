package com.mall.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "mall_info")
public class MallInfo implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mall_name", nullable = false, length = 100)
    private String mallName;

    @Column(length = 50)
    private String city;

    @Column(name = "total_floors", nullable = false)
    private Integer totalFloors;

    @Column(name = "total_units", nullable = false)
    private Integer totalUnits;

    public MallInfo() {}

    public MallInfo(String mallName, String city, Integer totalFloors, Integer totalUnits) {
        this.mallName = mallName;
        this.city = city;
        this.totalFloors = totalFloors;
        this.totalUnits = totalUnits;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMallName() {
        return mallName;
    }

    public void setMallName(String mallName) {
        this.mallName = mallName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getTotalFloors() {
        return totalFloors;
    }

    public void setTotalFloors(Integer totalFloors) {
        this.totalFloors = totalFloors;
    }

    public Integer getTotalUnits() {
        return totalUnits;
    }

    public void setTotalUnits(Integer totalUnits) {
        this.totalUnits = totalUnits;
    }
}
