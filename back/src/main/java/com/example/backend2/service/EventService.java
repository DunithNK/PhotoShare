package com.example.backend2.service;

import com.example.backend2.dto.EventDTO;
import com.example.backend2.model.Event;
import com.example.backend2.model.Organizer;
import com.example.backend2.repository.EventRepository;
import com.example.backend2.repository.OrganizerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final OrganizerRepository organizerRepository;

    @Autowired
    public EventService(EventRepository eventRepository, OrganizerRepository organizerRepository) {
        this.eventRepository = eventRepository;
        this.organizerRepository = organizerRepository;
    }

    public EventDTO createEvent(EventDTO eventDTO) {
        Event event = convertToEntity(eventDTO);
        event.setCreatedAt(LocalDateTime.now());
        Event savedEvent = eventRepository.save(event);
        return convertToDTO(savedEvent);
    }

    public List<EventDTO> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return events.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<EventDTO> getEventById(Long id) {
        return eventRepository.findById(id)
                .map(this::convertToDTO);
    }

    public Optional<EventDTO> updateEvent(Long id, EventDTO eventDTO) {
        return eventRepository.findById(id)
                .map(existingEvent -> {
                    // Update the existing event with values from DTO
                    existingEvent.setTitle(eventDTO.getTitle());
                    existingEvent.setDescription(eventDTO.getDescription());
                    existingEvent.setDate(eventDTO.getDate());
                    existingEvent.setTime(eventDTO.getTime());
                    existingEvent.setMode(eventDTO.getMode());

                    if (eventDTO.getMode() == Event.EventMode.online) {
                        existingEvent.setPlatform(eventDTO.getPlatform());
                        existingEvent.setPlace(null);
                    } else {
                        existingEvent.setPlace(eventDTO.getPlatform()); // Using platform field to store place
                        existingEvent.setPlatform(null);
                    }

                    // Update organizer if provided
                    if (eventDTO.getOrganizer() != null && eventDTO.getOrganizer().getId() != null) {
                        organizerRepository.findById(Math.toIntExact(eventDTO.getOrganizer().getId()))
                                .ifPresent(existingEvent::setOrganizer);
                    }

                    Event updatedEvent = eventRepository.save(existingEvent);
                    return convertToDTO(updatedEvent);
                });
    }

    public boolean deleteEvent(Long id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private Event convertToEntity(EventDTO eventDTO) {
        Event event = new Event();
        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setDate(eventDTO.getDate());
        event.setTime(eventDTO.getTime());
        event.setMode(eventDTO.getMode());

        // Set appropriate field based on mode
        if (eventDTO.getMode() == Event.EventMode.online) {
            event.setPlatform(eventDTO.getPlatform());
        } else {
            event.setPlace(eventDTO.getPlatform()); // Using platform field to store place
        }

        // Set organizer if provided
        if (eventDTO.getOrganizer() != null && eventDTO.getOrganizer().getId() != null) {
            organizerRepository.findById(Math.toIntExact(eventDTO.getOrganizer().getId()))
                    .ifPresent(event::setOrganizer);
        }

        return event;
    }

    private EventDTO convertToDTO(Event event) {
        EventDTO eventDTO = new EventDTO();
        eventDTO.setId(event.getId());
        eventDTO.setTitle(event.getTitle());
        eventDTO.setDescription(event.getDescription());
        eventDTO.setDate(event.getDate());
        eventDTO.setTime(event.getTime());
        eventDTO.setMode(event.getMode());

        // Set platform field based on mode
        if (event.getMode() == Event.EventMode.online) {
            eventDTO.setPlatform(event.getPlatform());
        } else {
            eventDTO.setPlatform(event.getPlace());
        }

        eventDTO.setOrganizer(event.getOrganizer());

        return eventDTO;
    }
}