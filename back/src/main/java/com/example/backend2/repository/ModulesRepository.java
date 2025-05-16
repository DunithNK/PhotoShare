package com.example.backend2.repository;

import com.example.backend2.model.CourseModules;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModulesRepository extends JpaRepository<CourseModules, Integer> {
}
