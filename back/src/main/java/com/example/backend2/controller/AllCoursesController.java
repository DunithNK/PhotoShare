package com.example.backend2.controller;

import com.example.backend2.model.AllCourses;
import com.example.backend2.model.Instructors;
import com.example.backend2.dto.AllCoursesDTO;
import com.example.backend2.repository.AllCoursesRepository;
import com.example.backend2.repository.InstructorsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
public class AllCoursesController {

    private final AllCoursesRepository courseRepository;
    private final InstructorsRepository instructorsRepository;



    @Autowired
    public AllCoursesController(
            AllCoursesRepository courseRepository,
            InstructorsRepository instructorsRepository

    ) {
        this.courseRepository = courseRepository;
        this.instructorsRepository = instructorsRepository;
    }


    @GetMapping
    public ResponseEntity<List<AllCoursesDTO>> getAllCourses() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<AllCourses> courses = courseRepository.findAll();
        List<AllCoursesDTO> coursesDTOs = courses.stream().map(this::convertToDTO).collect(Collectors.toList());

        return ResponseEntity.ok(coursesDTOs);
    }




    private AllCoursesDTO convertToDTO(AllCourses course) {
        AllCoursesDTO dto = new AllCoursesDTO();
        dto.setCourseId(course.getCourseId());
        dto.setTitle(course.getTitle());
        dto.setImageUrl(course.getImageUrl());
        dto.setRating(course.getRating());
        dto.setPrice(course.getPrice());
        dto.setDescription(course.getDescription());
        dto.setInstructorId(course.getInstructor().getInstructorId().longValue());
        dto.setInstructorName(course.getInstructor().getName());
        return dto;
    }



}
