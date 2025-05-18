package com.example.backend2.controller;

import com.example.backend2.dto.InstructorsDTO;
import com.example.backend2.model.Instructors;
import com.example.backend2.repository.InstructorsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/instructors")
public class InstructorsController {
    private final InstructorsRepository instructorsRepository;

    @Autowired
    public InstructorsController(InstructorsRepository instructorsRepository) {
        this.instructorsRepository = instructorsRepository;
    }

    @GetMapping
    public ResponseEntity<List<InstructorsDTO>> getAll() {
        List<Instructors> instructors = instructorsRepository.findAll();
        List<InstructorsDTO> instructorsDTOs = instructors.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(instructorsDTOs);
    }

    @GetMapping("/{instructorId}")
    public ResponseEntity<InstructorsDTO> getInstructorById(@PathVariable Integer instructorId) {
        Optional<Instructors> instructorOptional = instructorsRepository.findById(instructorId.longValue());
        return instructorOptional.map(instructor -> ResponseEntity.ok(convertToDTO(instructor)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<InstructorsDTO> createInstructor(@RequestBody InstructorsDTO instructorDTO) {
        Instructors instructor = new Instructors();
        instructor.setName(instructorDTO.getName());
        instructor.setBio(instructorDTO.getBio());
        instructor.setEmail(instructorDTO.getEmail());
        instructor.setProfileImageUrl(instructorDTO.getProfileImage());
        instructor.setCreatedAt(java.time.LocalDateTime.now());

        Instructors savedInstructor = instructorsRepository.save(instructor);
        return new ResponseEntity<>(convertToDTO(savedInstructor), HttpStatus.CREATED);
    }

    @PutMapping("/{instructorId}")
    public ResponseEntity<InstructorsDTO> updateInstructor(
            @PathVariable Integer instructorId,
            @RequestBody InstructorsDTO instructorDTO) {
        Optional<Instructors> instructorOptional = instructorsRepository.findById(instructorId.longValue());
        if (!instructorOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Instructors instructor = instructorOptional.get();
        instructor.setName(instructorDTO.getName());
        instructor.setBio(instructorDTO.getBio());
        instructor.setEmail(instructorDTO.getEmail());
        instructor.setProfileImageUrl(instructorDTO.getProfileImage());

        Instructors updatedInstructor = instructorsRepository.save(instructor);
        return ResponseEntity.ok(convertToDTO(updatedInstructor));
    }

    @DeleteMapping("/{instructorId}")
    public ResponseEntity<Void> deleteInstructor(@PathVariable Integer instructorId) {
        Optional<Instructors> instructorOptional = instructorsRepository.findById(instructorId.longValue());
        if (!instructorOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        instructorsRepository.delete(instructorOptional.get());
        return ResponseEntity.noContent().build();
    }

    private InstructorsDTO convertToDTO(Instructors instructors) {
        InstructorsDTO dto = new InstructorsDTO();
        dto.setInstructorId(instructors.getInstructorId());
        dto.setName(instructors.getName());
        dto.setEmail(instructors.getEmail());
        dto.setProfileImage(instructors.getProfileImageUrl());
        dto.setBio(instructors.getBio());
        return dto;
    }
}