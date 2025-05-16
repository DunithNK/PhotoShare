package com.example.backend2.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.BatchSize;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "courses")
@Data
public class AllCourses {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer courseId;

    @Column(nullable = false)
    private String title;

    @ManyToOne
    @JoinColumn(name = "instructor_id", nullable = false)
    private Instructors instructor;

    @Column(nullable = false)
    private BigDecimal price;

    private BigDecimal rating;

    private Integer reviewCount;

    @Column(nullable = false)
    private String description;

    private String imageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CourseModules> modules;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<LearningOutcome> learningOutcomes;
}