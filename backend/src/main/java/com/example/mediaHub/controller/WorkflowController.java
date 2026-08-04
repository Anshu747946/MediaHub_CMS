package com.example.mediaHub.controller;
import com.example.mediaHub.dto.request.WorkflowActionRequest;
import com.example.mediaHub.dto.response.*;
import com.example.mediaHub.service.WorkflowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/workflows") @RequiredArgsConstructor
public class WorkflowController {
    private final WorkflowService workflowService;
    @GetMapping("/pending") @PreAuthorize("hasRole('EDITOR')")
    public ResponseEntity<ApiResponse<List<WorkflowResponse>>> getPending(){
        return ResponseEntity.ok(ApiResponse.success("OK",workflowService.getMyPendingWorkflows()));
    }
    @GetMapping("/content/{contentId}") @PreAuthorize("hasAnyRole('EDITOR','MANAGER','CONTENT_CREATOR')")
    public ResponseEntity<ApiResponse<List<WorkflowResponse>>> getForContent(@PathVariable Long contentId){
        return ResponseEntity.ok(ApiResponse.success("OK",workflowService.getWorkflowsForContent(contentId)));
    }
    @PostMapping("/{id}/action") @PreAuthorize("hasRole('EDITOR')")
    public ResponseEntity<ApiResponse<WorkflowResponse>> action(@PathVariable Long id,@Valid @RequestBody WorkflowActionRequest req){
        return ResponseEntity.ok(ApiResponse.success("Action recorded",workflowService.takeAction(id,req)));
    }
    @PostMapping("/assign") @PreAuthorize("hasAnyRole('MANAGER','EDITOR')")
    public ResponseEntity<ApiResponse<WorkflowResponse>> assign(@RequestParam Long contentId,@RequestParam Long editorId){
        return ResponseEntity.ok(ApiResponse.success("Assigned",workflowService.createWorkflowForContent(contentId,editorId)));
    }
}
