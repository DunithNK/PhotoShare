package com.example.backend2.dto;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AllCoursesDTO {
    private int courseId;
    private String title;
    private String imageUrl;
    private BigDecimal rating;
    private BigDecimal price;
    private String description;
    private Long instructorId;
    private String instructorName;
}