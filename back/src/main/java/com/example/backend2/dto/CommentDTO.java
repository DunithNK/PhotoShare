package com.example.backend2.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private Long commentid;
    private Long postid;
    private Long userid;
    private String comment;
    private LocalDateTime createdAt;
    private String username;
}