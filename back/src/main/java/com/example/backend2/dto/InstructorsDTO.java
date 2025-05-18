package com.example.backend2.dto;

import lombok.Data;

@Data
public class InstructorsDTO {
    private Integer instructorId;
    private String name;
    private String bio;
    private String email;
    private String profileImage;
}
