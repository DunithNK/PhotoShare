package com.example.backend2.controller;

import com.example.backend2.dto.ProfileInfoDTO;
import com.example.backend2.dto.UpdateProfileDTO;
import com.example.backend2.model.User;
import com.example.backend2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class ProfileInfoController {
    private final UserRepository userRepository;

    @Autowired
    public ProfileInfoController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/{email}")
    public ResponseEntity<ProfileInfoDTO> getUserInfo(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    ProfileInfoDTO dto = new ProfileInfoDTO(
                            user.getId(),
                            user.getUserName(),
                            user.getEmail(),
                            user.getRole()
                    );
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfileInfoDTO> updateUser(@PathVariable Long id, @RequestBody UpdateProfileDTO updateData) {
        return userRepository.findById(id)
                .map(user -> {
                    // Update user fields
                    if (updateData.getUserName() != null) {
                        user.setUserName(updateData.getUserName());
                    }
                    if (updateData.getEmail() != null) {
                        user.setEmail(updateData.getEmail());
                    }

                    // Save updated user
                    User updatedUser = userRepository.save(user);

                    // Convert to DTO and return
                    ProfileInfoDTO dto = new ProfileInfoDTO(
                            updatedUser.getId(),
                            updatedUser.getUserName(),
                            updatedUser.getEmail(),
                            updatedUser.getRole()
                    );
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}