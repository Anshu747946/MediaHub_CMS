package com.example.mediaHub.dto.response;
import com.example.mediaHub.entity.enums.Role;
import lombok.*;
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String username;
    private Role role;
    private Long userId;
}
