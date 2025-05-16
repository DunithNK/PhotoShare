package com.example.backend2.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.BatchSize;

import java.util.List;

@Entity
@Table(name = "modules")
@Data
public class CourseModules {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer moduleId;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private AllCourses course;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Integer sequenceNumber;

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Topic> topics;
}
