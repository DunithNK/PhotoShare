package com.example.backend2.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "learning_outcomes")
@Data
public class LearningOutcome {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer outcomeId;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private AllCourses course;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Integer sequenceNumber;
}
