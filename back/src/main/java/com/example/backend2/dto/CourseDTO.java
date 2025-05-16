package com.example.backend2.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CourseDTO {
    private Integer courseId;
    private String title;
    private Long instructorId;
    private String instructorName;
    private BigDecimal price;
    private BigDecimal rating;
    private Integer reviewCount;
    private String description;
    private String imageUrl;
    private List<CourseModulesDTO> modules;
    private List<LearningOutcomeDTO> outcomes;
}
