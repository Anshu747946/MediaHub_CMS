package com.example.mediaHub.entity;
import com.example.mediaHub.entity.enums.PlatformType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="channels") @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Channel {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(unique=true,nullable=false,length=200) private String name;
    @Enumerated(EnumType.STRING) @Column(name="platform_type",nullable=false) private PlatformType platformType;
    @Column(name="api_endpoint",length=1000) private String apiEndpoint;
    @Column(name="is_active") @Builder.Default private Boolean isActive=true;
    @Column(name="created_at",updatable=false) private LocalDateTime createdAt;
    @PrePersist protected void onCreate(){createdAt=LocalDateTime.now();}
}
