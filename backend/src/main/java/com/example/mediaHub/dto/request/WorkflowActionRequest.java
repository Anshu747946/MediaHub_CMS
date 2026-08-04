package com.example.mediaHub.dto.request;
import com.example.mediaHub.entity.enums.StageStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data public class WorkflowActionRequest {
    @NotNull private StageStatus decision;
    private String comments;
}
