package com.example.backend2.repository;



import com.example.backend2.model.AllCourses;
import com.example.backend2.model.CourseModules;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<AllCourses, Integer> {
    // Option 1: Split into separate queries
    @Query("SELECT c FROM AllCourses c LEFT JOIN FETCH c.instructor WHERE c.courseId = :courseId")
    Optional<AllCourses> findCourseWithInstructor(Integer courseId);

    @Query("SELECT c FROM AllCourses c LEFT JOIN FETCH c.modules WHERE c.courseId = :courseId")
    Optional<AllCourses> findCourseWithModules(Integer courseId);

    @Query("SELECT c FROM AllCourses c LEFT JOIN FETCH c.learningOutcomes WHERE c.courseId = :courseId")
    Optional<AllCourses> findCourseWithOutcomes(Integer courseId);

    @Query("SELECT m FROM CourseModules m LEFT JOIN FETCH m.topics WHERE m.course.courseId = :courseId")
    List<CourseModules> findModulesWithTopicsByCourseId(Integer courseId);
}