package com.example.mediaHub.controller;
import com.example.mediaHub.dto.request.*;
import com.example.mediaHub.dto.response.*;
import com.example.mediaHub.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest req){
        return ResponseEntity.ok(ApiResponse.success("Registered successfully",authService.register(req)));
    }
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest req){
        return ResponseEntity.ok(ApiResponse.success("Login successful",authService.login(req)));
    }
}
