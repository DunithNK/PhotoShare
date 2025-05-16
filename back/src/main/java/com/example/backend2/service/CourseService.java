package com.example.backend2.service;

import com.example.backend2.dto.CourseDTO;
import com.example.backend2.dto.LearningOutcomeDTO;
import com.example.backend2.dto.CourseModulesDTO;
import com.example.backend2.dto.TopicDTO;
import com.example.backend2.model.AllCourses;
import com.example.backend2.model.Instructors;
import com.example.backend2.model.LearningOutcome;
import com.example.backend2.model.CourseModules;
import com.example.backend2.model.Topic;
import com.example.backend2.repository.CourseRepository;
import com.example.backend2.repository.InstructorsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private InstructorsRepository instructorsRepository;

    public AllCourses saveCourse(CourseDTO courseDTO) {
        Optional<Instructors> instructorOpt = instructorsRepository.findById(courseDTO.getInstructorId());
        if (!instructorOpt.isPresent()) {
            throw new IllegalArgumentException("Instructor not found");
        }

        AllCourses course = new AllCourses();
        course.setTitle(courseDTO.getTitle());
        course.setInstructor(instructorOpt.get());
        course.setPrice(courseDTO.getPrice());
        course.setDescription(courseDTO.getDescription());
        course.setImageUrl(courseDTO.getImageUrl());
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());

        // Map Modules
        List<CourseModules> modules = new ArrayList<>();
        for (CourseModulesDTO moduleDTO : courseDTO.getModules()) {
            CourseModules module = new CourseModules();
            module.setCourse(course);
            module.setTitle(moduleDTO.getTitle());
            module.setSequenceNumber(moduleDTO.getSequence());

            // Map Topics
            List<Topic> topics = new ArrayList<>();
            for (TopicDTO topicDTO : moduleDTO.getTopics()) {
                Topic topic = new Topic();
                topic.setModule(module);
                topic.setTitle(topicDTO.getTitle());
                topic.setSequenceNumber(topicDTO.getSequence());
                topics.add(topic);
            }
            module.setTopics(topics);
            modules.add(module);
        }
        course.setModules(modules);

        // Map Learning Outcomes
        List<LearningOutcome> outcomes = new ArrayList<>();
        for (LearningOutcomeDTO outcomeDTO : courseDTO.getOutcomes()) {
            LearningOutcome outcome = new LearningOutcome();
            outcome.setCourse(course);
            outcome.setDescription(outcomeDTO.getDescription());
            outcome.setSequenceNumber(outcomeDTO.getSequence());
            outcomes.add(outcome);
        }
        course.setLearningOutcomes(outcomes);

        return courseRepository.save(course);
    }

    public CourseDTO getCourseById(Integer courseId) {
        // First, get the course with instructor
        Optional<AllCourses> courseWithInstructorOpt = courseRepository.findCourseWithInstructor(courseId);

        if (!courseWithInstructorOpt.isPresent()) {
            throw new IllegalArgumentException("Course not found with ID: " + courseId);
        }

        AllCourses course = courseWithInstructorOpt.get();

        // Load learning outcomes separately
        Optional<AllCourses> courseWithOutcomesOpt = courseRepository.findCourseWithOutcomes(courseId);
        if (courseWithOutcomesOpt.isPresent()) {
            course.setLearningOutcomes(courseWithOutcomesOpt.get().getLearningOutcomes());
        }

        // Load modules separately
        Optional<AllCourses> courseWithModulesOpt = courseRepository.findCourseWithModules(courseId);
        if (courseWithModulesOpt.isPresent()) {
            course.setModules(courseWithModulesOpt.get().getModules());
        }

        // Load topics for modules
        List<CourseModules> modulesWithTopics = courseRepository.findModulesWithTopicsByCourseId(courseId);
        Map<Integer, CourseModules> moduleMap = new HashMap<>();

        // Create a map of modules for easy lookup
        for (CourseModules module : modulesWithTopics) {
            moduleMap.put(module.getModuleId(), module);
        }

        // Update the topics in each module
        for (CourseModules module : course.getModules()) {
            CourseModules moduleWithTopics = moduleMap.get(module.getModuleId());
            if (moduleWithTopics != null) {
                module.setTopics(moduleWithTopics.getTopics());
            }
        }

        return mapToCourseDTO(course);
    }

    private CourseDTO mapToCourseDTO(AllCourses course) {
        CourseDTO courseDTO = new CourseDTO();
        courseDTO.setCourseId(course.getCourseId());
        courseDTO.setTitle(course.getTitle());
        courseDTO.setInstructorId(Long.valueOf(course.getInstructor().getInstructorId()));
        courseDTO.setInstructorName(course.getInstructor().getName());
        courseDTO.setPrice(course.getPrice());
        courseDTO.setRating(course.getRating());
        courseDTO.setReviewCount(course.getReviewCount());
        courseDTO.setDescription(course.getDescription());
        courseDTO.setImageUrl(course.getImageUrl());

        // Map Learning Outcomes
        List<LearningOutcomeDTO> outcomeDTOs = new ArrayList<>();
        for (LearningOutcome outcome : course.getLearningOutcomes()) {
            LearningOutcomeDTO outcomeDTO = new LearningOutcomeDTO();
            outcomeDTO.setOutcomeId(outcome.getOutcomeId());
            outcomeDTO.setDescription(outcome.getDescription());
            outcomeDTO.setSequence(outcome.getSequenceNumber());
            outcomeDTOs.add(outcomeDTO);
        }
        courseDTO.setOutcomes(outcomeDTOs);

        // Map Modules and Topics
        List<CourseModulesDTO> moduleDTOs = new ArrayList<>();
        for (CourseModules module : course.getModules()) {
            CourseModulesDTO moduleDTO = new CourseModulesDTO();
            moduleDTO.setModuleId(module.getModuleId());
            moduleDTO.setTitle(module.getTitle());
            moduleDTO.setSequence(module.getSequenceNumber());

            // Map Topics
            List<TopicDTO> topicDTOs = new ArrayList<>();
            for (Topic topic : module.getTopics()) {
                TopicDTO topicDTO = new TopicDTO();
                topicDTO.setTopicId(topic.getTopicId());
                topicDTO.setTitle(topic.getTitle());
                topicDTO.setSequence(topic.getSequenceNumber());
                topicDTOs.add(topicDTO);
            }
            moduleDTO.setTopics(topicDTOs);
            moduleDTOs.add(moduleDTO);
        }
        courseDTO.setModules(moduleDTOs);

        return courseDTO;
    }

    public AllCourses updateCourse(Integer courseId, CourseDTO courseDTO) {
        Optional<AllCourses> courseOpt = courseRepository.findById(courseId);
        if (!courseOpt.isPresent()) {
            throw new IllegalArgumentException("Course not found with ID: " + courseId);
        }

        Optional<Instructors> instructorOpt = instructorsRepository.findById(courseDTO.getInstructorId());
        if (!instructorOpt.isPresent()) {
            throw new IllegalArgumentException("Instructor not found");
        }

        AllCourses course = courseOpt.get();
        course.setTitle(courseDTO.getTitle());
        course.setInstructor(instructorOpt.get());
        course.setPrice(courseDTO.getPrice());
        course.setDescription(courseDTO.getDescription());
        course.setImageUrl(courseDTO.getImageUrl());
        course.setUpdatedAt(LocalDateTime.now());

        // Update Modules
        course.getModules().clear(); // Remove existing modules
        List<CourseModules> modules = new ArrayList<>();
        for (CourseModulesDTO moduleDTO : courseDTO.getModules()) {
            CourseModules module = new CourseModules();
            module.setCourse(course);
            module.setTitle(moduleDTO.getTitle());
            module.setSequenceNumber(moduleDTO.getSequence());

            // Map Topics
            List<Topic> topics = new ArrayList<>();
            for (TopicDTO topicDTO : moduleDTO.getTopics()) {
                Topic topic = new Topic();
                topic.setModule(module);
                topic.setTitle(topicDTO.getTitle());
                topic.setSequenceNumber(topicDTO.getSequence());
                topics.add(topic);
            }
            module.setTopics(topics);
            modules.add(module);
        }
        course.setModules(modules);

        // Update Learning Outcomes
        course.getLearningOutcomes().clear(); // Remove existing outcomes
        List<LearningOutcome> outcomes = new ArrayList<>();
        for (LearningOutcomeDTO outcomeDTO : courseDTO.getOutcomes()) {
            LearningOutcome outcome = new LearningOutcome();
            outcome.setCourse(course);
            outcome.setDescription(outcomeDTO.getDescription());
            outcome.setSequenceNumber(outcomeDTO.getSequence());
            outcomes.add(outcome);
        }
        course.setLearningOutcomes(outcomes);

        return courseRepository.save(course);
    }

    public void deleteCourse(Integer courseId) {
        Optional<AllCourses> courseOpt = courseRepository.findById(courseId);
        if (!courseOpt.isPresent()) {
            throw new IllegalArgumentException("Course not found with ID: " + courseId);
        }
        courseRepository.deleteById(courseId);
    }


}
