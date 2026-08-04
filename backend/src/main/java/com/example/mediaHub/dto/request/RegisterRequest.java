package com.example.mediaHub.dto.request;
import com.example.mediaHub.entity.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data public class RegisterRequest {
    @NotBlank @Size(min=3,max=100) private String username;
    @NotBlank @Email private String email;
    @NotBlank @Pattern(regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
        message="Password must be 8+ chars with uppercase, lowercase, digit, special char")
    private String password;
    @NotNull private Role role;
}
