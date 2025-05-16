package com.example.backend2.service;

import com.example.backend2.dto.InstructorsDTO;
import com.example.backend2.model.Instructors;
import com.example.backend2.repository.InstructorsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InstructorService {

    @Autowired
    private InstructorsRepository instructorsRepository;

    public Instructors saveInstructor(InstructorsDTO instructorDTO) {
        Instructors instructor = new Instructors();
        instructor.setName(instructorDTO.getName());
        instructor.setBio(instructorDTO.getBio());
        instructor.setEmail(instructorDTO.getEmail());
        instructor.setProfileImageUrl(instructorDTO.getProfileImage());
        instructor.setCreatedAt(LocalDateTime.now());
        return instructorsRepository.save(instructor);
    }

    public List<Instructors> getAllInstructors() {
        return instructorsRepository.findAll();
    }
}

