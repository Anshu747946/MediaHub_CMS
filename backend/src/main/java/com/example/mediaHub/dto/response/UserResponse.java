package com.example.mediaHub.dto.response;

import com.example.mediaHub.entity.User;
import com.example.mediaHub.entity.enums.Role;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

/*
 * Safe user representation for the Manager "Team" page.
 * NEVER includes passwordHash — only fields safe to expose to a manager.
 */
@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private Role role;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public static UserResponse fromEntity(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .username(u.getUsername())
                .email(u.getEmail())
                .role(u.getRole())
                .isActive(u.getIsActive())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
