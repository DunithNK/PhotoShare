package com.example.backend2.controller;

import com.example.backend2.dto.OrganizerDTO;
import com.example.backend2.model.Organizer;
import com.example.backend2.repository.OrganizerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/organizer")
public class OrganizerController {

    private final OrganizerRepository organizerRepository;

    @Autowired
    public OrganizerController(OrganizerRepository organizerRepository) {
        this.organizerRepository = organizerRepository;
    }

    @PostMapping
    public ResponseEntity<OrganizerDTO> createOrganizer(@RequestBody OrganizerDTO organizerDTO) {
        try {

            Organizer organizer = new Organizer();
            organizer.setName(organizerDTO.getName());
            organizer.setContactEmail(organizerDTO.getEmail());
            organizer.setCreatedAt(LocalDateTime.now());


            Organizer savedOrganizer = organizerRepository.save(organizer);


            OrganizerDTO savedDTO = new OrganizerDTO();
            savedDTO.setId((long) savedOrganizer.getId().longValue());
            savedDTO.setName(savedOrganizer.getName());
            savedDTO.setEmail(savedOrganizer.getContactEmail());

            return new ResponseEntity<>(savedDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<OrganizerDTO>> getAllOrganizers() {
        try {
            List<Organizer> organizers = organizerRepository.findAll();

            // Convert entities to DTOs
            List<OrganizerDTO> organizerDTOs = organizers.stream()
                    .map(organizer -> {
                        OrganizerDTO dto = new OrganizerDTO();
                        dto.setId((long) organizer.getId().longValue());
                        dto.setName(organizer.getName());
                        dto.setEmail(organizer.getContactEmail());
                        return dto;
                    })
                    .collect(Collectors.toList());

            return new ResponseEntity<>(organizerDTOs, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrganizerDTO> getOrganizerById(@PathVariable("id") int id) {
        try {
            Organizer organizer = organizerRepository.findById(id)
                    .orElse(null);

            if (organizer == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            OrganizerDTO dto = new OrganizerDTO();
            dto.setId((long) organizer.getId().longValue());
            dto.setName(organizer.getName());
            dto.setEmail(organizer.getContactEmail());

            return new ResponseEntity<>(dto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrganizerDTO> updateOrganizer(
            @PathVariable("id") int id,
            @RequestBody OrganizerDTO organizerDTO) {
        try {
            Organizer organizer = organizerRepository.findById(id)
                    .orElse(null);

            if (organizer == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            // Update fields
            organizer.setName(organizerDTO.getName());
            organizer.setContactEmail(organizerDTO.getEmail());

            // Save updated entity
            Organizer updatedOrganizer = organizerRepository.save(organizer);

            // Convert to DTO
            OrganizerDTO updatedDTO = new OrganizerDTO();
            updatedDTO.setId((long) updatedOrganizer.getId().longValue());
            updatedDTO.setName(updatedOrganizer.getName());
            updatedDTO.setEmail(updatedOrganizer.getContactEmail());

            return new ResponseEntity<>(updatedDTO, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteOrganizer(@PathVariable("id") int id) {
        try {
            organizerRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
