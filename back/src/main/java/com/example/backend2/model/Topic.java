package com.example.backend2.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "topics")
@Data
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer topicId;

    @ManyToOne
    @JoinColumn(name = "module_id", nullable = false)
    private CourseModules module;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Integer sequenceNumber;
}
