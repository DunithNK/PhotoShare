package com.example.backend2.dto;
import com.example.backend2.model.Event;
import com.example.backend2.model.Organizer;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EventDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate date;
    private LocalTime time;
    private Event.EventMode mode;
    private String platform; // Used for both platform (online) and place (physical)
    private Organizer organizer;
}