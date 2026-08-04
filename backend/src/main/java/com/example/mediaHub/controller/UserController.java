package com.example.mediaHub.controller;

import com.example.mediaHub.dto.response.ApiResponse;
import com.example.mediaHub.dto.response.UserResponse;
import com.example.mediaHub.entity.User;
import com.example.mediaHub.entity.enums.Role;
import com.example.mediaHub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/*
 * User management API — restricted to MANAGER and IT_SUPPORT.
 * Covers case study requirements:
 *  - Manager: "add delete and all whatever rights a manager should have"
 *  - IT Support: "Ensures data security" / access administration
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    /** List all users in the system */
    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER','IT_SUPPORT')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userRepository.findAll()
                .stream()
                .map(UserResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }

    /** Change a user's role — MANAGER or IT_SUPPORT only */
    @PutMapping("/{id}/role")
    @PreAuthorize("hasAnyRole('MANAGER','IT_SUPPORT')")
    public ResponseEntity<ApiResponse<UserResponse>> updateRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Role newRole;
        try {
            newRole = Role.valueOf(body.get("role"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid role value. Must be one of: CONTENT_CREATOR, EDITOR, MARKETING, MANAGER, IT_SUPPORT"));
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(newRole);
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("Role updated", UserResponse.fromEntity(user)));
    }

    /** Activate or deactivate a user account — MANAGER or IT_SUPPORT only */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('MANAGER','IT_SUPPORT')")
    public ResponseEntity<ApiResponse<UserResponse>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(body.get("isActive"));
        userRepository.save(user);
        String msg = Boolean.TRUE.equals(body.get("isActive")) ? "User activated" : "User deactivated";
        return ResponseEntity.ok(ApiResponse.success(msg, UserResponse.fromEntity(user)));
    }

    /** Permanently delete a user — MANAGER or IT_SUPPORT only */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER','IT_SUPPORT')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted", null));
    }
}
