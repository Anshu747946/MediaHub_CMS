package com.example.mediaHub.entity;
import com.example.mediaHub.entity.enums.ContentStatus;
import com.example.mediaHub.entity.enums.ContentType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="content") @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Content {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="created_by",nullable=false) private User createdBy;
    @Column(nullable=false,length=500) private String title;
    @Column(columnDefinition="TEXT") private String description;
    @Enumerated(EnumType.STRING) @Column(name="content_type",nullable=false) @Builder.Default private ContentType contentType=ContentType.ARTICLE;
    @Enumerated(EnumType.STRING) @Column(nullable=false) @Builder.Default private ContentStatus status=ContentStatus.DRAFT;
    @Column(columnDefinition="LONGTEXT") private String body;
    @Column(name="media_url",length=1000) private String mediaUrl;
    @Column(columnDefinition="JSON") private String tags;
    @Column(name="scheduled_at") private LocalDateTime scheduledAt;
    @Column(name="published_at") private LocalDateTime publishedAt;
    @Column(name="created_at",updatable=false) private LocalDateTime createdAt;
    @Column(name="updated_at") private LocalDateTime updatedAt;
    @PrePersist protected void onCreate(){createdAt=LocalDateTime.now();updatedAt=LocalDateTime.now();}
    @PreUpdate  protected void onUpdate(){updatedAt=LocalDateTime.now();}
}
