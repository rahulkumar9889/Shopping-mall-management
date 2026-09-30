package com.mall.repository;

import com.mall.model.MallInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MallInfoRepository extends JpaRepository<MallInfo, Long> {
}
