package com.example.backend2.service;

import com.example.backend2.dto.OrganizerDTO;
import com.example.backend2.model.Organizer;
import com.example.backend2.repository.OrganizerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrganizerService {

    private final OrganizerRepository organizerRepository;

    @Autowired
    public OrganizerService(OrganizerRepository organizerRepository) {
        this.organizerRepository = organizerRepository;
    }

    public OrganizerDTO createOrganizer(OrganizerDTO organizerDTO) {
        Organizer organizer = convertToEntity(organizerDTO);
        organizer.setCreatedAt(LocalDateTime.now());

        Organizer savedOrganizer = organizerRepository.save(organizer);
        return convertToDTO(savedOrganizer);
    }

    public List<OrganizerDTO> getAllOrganizers() {
        List<Organizer> organizers = organizerRepository.findAll();
        return organizers.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<OrganizerDTO> getOrganizerById(Integer id) {
        return organizerRepository.findById(id)
                .map(this::convertToDTO);
    }

    public Optional<OrganizerDTO> updateOrganizer(Integer id, OrganizerDTO organizerDTO) {
        return organizerRepository.findById(id)
                .map(organizer -> {
                    organizer.setName(organizerDTO.getName());
                    organizer.setContactEmail(organizerDTO.getEmail());
                    return convertToDTO(organizerRepository.save(organizer));
                });
    }

    public boolean deleteOrganizer(Integer id) {
        if (organizerRepository.existsById(id)) {
            organizerRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private Organizer convertToEntity(OrganizerDTO dto) {
        Organizer entity = new Organizer();
        entity.setName(dto.getName());
        entity.setContactEmail(dto.getEmail());
        return entity;
    }

    private OrganizerDTO convertToDTO(Organizer entity) {
        OrganizerDTO dto = new OrganizerDTO();
        dto.setId((long) entity.getId().intValue());
        dto.setName(entity.getName());
        dto.setEmail(entity.getContactEmail());
        return dto;
    }
}
