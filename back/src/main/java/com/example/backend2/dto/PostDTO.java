package com.example.backend2.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PostDTO {
    private Long postid;
    private Long userid;
    private String username;
    private String postlink;
    private LocalDateTime createdAt;
    private String category;
}