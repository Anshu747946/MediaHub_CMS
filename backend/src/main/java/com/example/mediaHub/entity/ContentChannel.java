package com.example.mediaHub.entity;
import com.example.mediaHub.entity.enums.DistributionStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="content_channels") @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ContentChannel {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="content_id",nullable=false) private Content content;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="channel_id",nullable=false) private Channel channel;
    @Enumerated(EnumType.STRING) @Column(name="dist_status",nullable=false) @Builder.Default private DistributionStatus distStatus=DistributionStatus.PENDING;
    @Column(name="distributed_at") private LocalDateTime distributedAt;
    @Column(name="created_at",updatable=false) private LocalDateTime createdAt;
    @PrePersist protected void onCreate(){createdAt=LocalDateTime.now();}
}
