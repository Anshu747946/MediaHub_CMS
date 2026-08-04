package com.example.mediaHub.service;
import com.example.mediaHub.dto.request.*;
import com.example.mediaHub.dto.response.AuthResponse;
import com.example.mediaHub.entity.User;
import com.example.mediaHub.repository.UserRepository;
import com.example.mediaHub.security.JwtService;
import com.example.mediaHub.entity.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest req){
        if(userRepository.existsByEmail(req.getEmail())) throw new RuntimeException("Email already registered");
        if(userRepository.existsByUsername(req.getUsername())) throw new RuntimeException("Username already taken");
        // Enterprise Rule: All self-registered users are CONTENT_CREATOR.
        // Role promotion is done exclusively by a MANAGER via the admin API.
        User user=User.builder().username(req.getUsername()).email(req.getEmail())
            .passwordHash(passwordEncoder.encode(req.getPassword())).role(Role.CONTENT_CREATOR).isActive(true).build();
        User saved=userRepository.save(user);
        return AuthResponse.builder().token(jwtService.generateToken(saved))
            .email(saved.getEmail()).username(saved.getUsername()).role(saved.getRole()).userId(saved.getId()).build();
    }

    public AuthResponse login(LoginRequest req){
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(),req.getPassword()));
        User user=userRepository.findByEmail(req.getEmail()).orElseThrow(()->new RuntimeException("User not found"));
        return AuthResponse.builder().token(jwtService.generateToken(user))
            .email(user.getEmail()).username(user.getUsername()).role(user.getRole()).userId(user.getId()).build();
    }
}
