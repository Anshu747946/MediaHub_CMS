package com.example.mediaHub.entity;
import com.example.mediaHub.entity.enums.StageStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="approval_workflows") @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ApprovalWorkflow {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="content_id",nullable=false) private Content content;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="assigned_to",nullable=false) private User assignedTo;
    @Column(name="stage_order",nullable=false) @Builder.Default private Integer stageOrder=1;
    @Enumerated(EnumType.STRING) @Column(name="stage_status",nullable=false) @Builder.Default private StageStatus stageStatus=StageStatus.PENDING;
    @Column(columnDefinition="TEXT") private String comments;
    @Column(name="actioned_at") private LocalDateTime actionedAt;
    @Column(name="created_at",updatable=false) private LocalDateTime createdAt;
    @PrePersist protected void onCreate(){createdAt=LocalDateTime.now();}
}
