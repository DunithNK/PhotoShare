package com.example.backend2.dto;

import  lombok.Data;

import java.util.List;


@Data
public class CourseModulesDTO {
    private Integer moduleId;
    private String title;
    private Integer sequence;
    private List<TopicDTO> topics;
}
