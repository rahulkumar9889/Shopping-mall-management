package com.mall.repository;

import com.mall.model.Officer;
import com.mall.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfficerRepository extends JpaRepository<Officer, Long> {
    Optional<Officer> findByUser(User user);
    Optional<Officer> findByUser_Username(String username);
    List<Officer> findByAssignedFloor(Integer floor);
}
