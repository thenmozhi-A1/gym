package com.example.gym.repository;

import com.example.gym.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface StaffRepository extends JpaRepository<Staff, Long> {
}
