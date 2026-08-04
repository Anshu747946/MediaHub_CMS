package com.example.mediaHub.service;
import com.example.mediaHub.dto.request.WorkflowActionRequest;
import com.example.mediaHub.dto.response.WorkflowResponse;
import com.example.mediaHub.entity.*;
import com.example.mediaHub.entity.enums.*;
import com.example.mediaHub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
@Service @RequiredArgsConstructor
public class WorkflowService {
    private final ApprovalWorkflowRepository workflowRepository;
    private final ContentRepository contentRepository;
    private final UserRepository userRepository;

    private User getCurrentUser(){
        String email=SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));
    }

    @Transactional
    public WorkflowResponse createWorkflowForContent(Long contentId,Long assignedToId){
        Content content=contentRepository.findById(contentId).orElseThrow(()->new RuntimeException("Content not found"));
        User assignedTo=userRepository.findById(assignedToId).orElseThrow(()->new RuntimeException("Editor not found"));
        workflowRepository.findByContentIdAndStageStatus(contentId,StageStatus.PENDING)
            .ifPresent(w->{throw new RuntimeException("Pending workflow already exists");});
        ApprovalWorkflow wf=ApprovalWorkflow.builder().content(content).assignedTo(assignedTo)
            .stageOrder(1).stageStatus(StageStatus.PENDING).build();
        return WorkflowResponse.fromEntity(workflowRepository.save(wf));
    }

    @Transactional(readOnly=true)
    public List<WorkflowResponse> getMyPendingWorkflows(){
        return workflowRepository.findByStageStatus(StageStatus.PENDING)
            .stream().map(WorkflowResponse::fromEntity).toList();
    }

    @Transactional(readOnly=true)
    public List<WorkflowResponse> getWorkflowsForContent(Long contentId){
        return workflowRepository.findByContentIdOrderByStageOrderAsc(contentId)
            .stream().map(WorkflowResponse::fromEntity).toList();
    }

    @Transactional
    public WorkflowResponse takeAction(Long workflowId,WorkflowActionRequest req){
        User editor=getCurrentUser();
        ApprovalWorkflow wf=workflowRepository.findById(workflowId).orElseThrow(()->new RuntimeException("Workflow not found"));
        if(wf.getStageStatus()!=StageStatus.PENDING) throw new RuntimeException("Workflow already actioned: "+wf.getStageStatus());
        if((req.getDecision()==StageStatus.REJECTED||req.getDecision()==StageStatus.CHANGES_REQUESTED)
            &&(req.getComments()==null||req.getComments().isBlank()))
            throw new RuntimeException("Comments required when rejecting");
        wf.setStageStatus(req.getDecision());wf.setComments(req.getComments());wf.setActionedAt(LocalDateTime.now());
        wf.setAssignedTo(editor);
        Content content=wf.getContent();
        switch(req.getDecision()){
            case APPROVED->content.setStatus(ContentStatus.APPROVED);
            case REJECTED,CHANGES_REQUESTED->content.setStatus(ContentStatus.REJECTED);
            default->throw new RuntimeException("Invalid decision");
        }
        contentRepository.save(content);
        return WorkflowResponse.fromEntity(workflowRepository.save(wf));
    }
}
