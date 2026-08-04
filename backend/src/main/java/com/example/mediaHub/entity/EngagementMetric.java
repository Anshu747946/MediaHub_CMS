package com.example.mediaHub.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name="engagement_metrics") @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EngagementMetric {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="content_id",nullable=false) private Content content;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="channel_id") private Channel channel;
    @Builder.Default private Integer views=0;
    @Builder.Default private Integer likes=0;
    @Builder.Default private Integer shares=0;
    @Column(name="comments_count") @Builder.Default private Integer commentsCount=0;
    @Column(name="metric_date",nullable=false) private LocalDate metricDate;
    @Column(name="created_at",updatable=false) private LocalDateTime createdAt;
    @Column(name="updated_at") private LocalDateTime updatedAt;
    @PrePersist protected void onCreate(){createdAt=LocalDateTime.now();updatedAt=LocalDateTime.now();}
    @PreUpdate  protected void onUpdate(){updatedAt=LocalDateTime.now();}
}
