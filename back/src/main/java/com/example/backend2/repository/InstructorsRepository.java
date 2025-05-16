package com.example.backend2.repository;

import com.example.backend2.model.Instructors;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstructorsRepository extends JpaRepository<Instructors, Long> {
}
