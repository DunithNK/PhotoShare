package com.example.backend2.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
@Data
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userid", nullable = false)
    private User user;

    @Column(name = "postlink", nullable = false)
    private String postlink;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name="category")
    private  String category;
}