package com.example.backend2.controller;


import com.example.backend2.dto.CourseDTO;
import com.example.backend2.model.AllCourses;
import com.example.backend2.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    @Autowired
    private CourseService courseService;

    @PostMapping
    public ResponseEntity<AllCourses> createCourse(@RequestBody CourseDTO courseDTO) {
        AllCourses course = courseService.saveCourse(courseDTO);
        return ResponseEntity.ok(course);
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable Integer courseId) {
        CourseDTO courseDTO = courseService.getCourseById(courseId);
        return ResponseEntity.ok(courseDTO);
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<AllCourses> updateCourse(
            @PathVariable Integer courseId,
            @RequestBody CourseDTO courseDTO
    ) {
        AllCourses updatedCourse = courseService.updateCourse(courseId, courseDTO);
        return ResponseEntity.ok(updatedCourse);
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Integer courseId) {
        courseService.deleteCourse(courseId);
        return ResponseEntity.noContent().build();
    }
}
