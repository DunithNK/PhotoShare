package com.example.backend2.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "instructors")
@Data
public class Instructors {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer instructorId;

    @Column(nullable = false)
    private String name;

    private String bio;

    private String email;

    private String profileImageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
