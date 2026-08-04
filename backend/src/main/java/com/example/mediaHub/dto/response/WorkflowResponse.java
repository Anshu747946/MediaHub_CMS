package com.example.mediaHub.dto.response;
import com.example.mediaHub.entity.ApprovalWorkflow;
import com.example.mediaHub.entity.enums.StageStatus;
import lombok.*;
import java.time.LocalDateTime;
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class WorkflowResponse {
    private Long id,contentId,assignedToId;
    private String contentTitle,assignedToName,comments;
    private Integer stageOrder;
    private StageStatus stageStatus;
    private LocalDateTime actionedAt,createdAt;
    public static WorkflowResponse fromEntity(ApprovalWorkflow w){
        return WorkflowResponse.builder().id(w.getId()).contentId(w.getContent().getId())
            .contentTitle(w.getContent().getTitle()).assignedToId(w.getAssignedTo().getId())
            .assignedToName(w.getAssignedTo().getUsername()).stageOrder(w.getStageOrder())
            .stageStatus(w.getStageStatus()).comments(w.getComments()).actionedAt(w.getActionedAt()).createdAt(w.getCreatedAt()).build();
    }
}
