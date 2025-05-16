package com.example.backend2.repository;

import com.example.backend2.model.AllCourses;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AllCoursesRepository extends JpaRepository<AllCourses, Integer> {
}