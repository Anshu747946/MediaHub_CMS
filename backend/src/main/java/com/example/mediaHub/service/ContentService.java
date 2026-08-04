package com.example.mediaHub.service;
import com.example.mediaHub.dto.request.ContentRequest;
import com.example.mediaHub.dto.response.ContentResponse;
import com.example.mediaHub.entity.Content;
import com.example.mediaHub.entity.User;
import com.example.mediaHub.entity.enums.ContentStatus;
import com.example.mediaHub.repository.ContentRepository;
import com.example.mediaHub.repository.UserRepository;
import com.example.mediaHub.repository.ApprovalWorkflowRepository;
import com.example.mediaHub.entity.ApprovalWorkflow;
import com.example.mediaHub.entity.enums.StageStatus;
import com.example.mediaHub.entity.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service @RequiredArgsConstructor
public class ContentService {
    private final ContentRepository contentRepository;
    private final UserRepository userRepository;
    private final ApprovalWorkflowRepository workflowRepository;

    private User getCurrentUser(){
        String email=SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));
    }

    @Transactional
    public ContentResponse createContent(ContentRequest req){
        User creator=getCurrentUser();
        Content c=Content.builder().title(req.getTitle()).description(req.getDescription())
            .contentType(req.getContentType()).body(req.getBody()).mediaUrl(req.getMediaUrl())
            .tags(req.getTags()!=null?req.getTags().toString():null)
            .status(ContentStatus.DRAFT).createdBy(creator).build();
        return ContentResponse.fromEntity(contentRepository.save(c));
    }

    @Transactional(readOnly=true)
    public List<ContentResponse> getMyContent(){
        return contentRepository.findByCreatedById(getCurrentUser().getId()).stream().map(ContentResponse::fromEntity).toList();
    }

    @Transactional(readOnly=true)
    public List<ContentResponse> getAllContent(){
        return contentRepository.findAll().stream().map(ContentResponse::fromEntity).toList();
    }

    @Transactional(readOnly=true)
    public List<ContentResponse> getContentByStatus(ContentStatus status){
        return contentRepository.findByStatus(status).stream().map(ContentResponse::fromEntity).toList();
    }

    @Transactional(readOnly=true)
    public ContentResponse getContentById(Long id){
        return ContentResponse.fromEntity(contentRepository.findById(id)
            .orElseThrow(()->new RuntimeException("Content not found: "+id)));
    }

    @Transactional
    public ContentResponse updateContent(Long id,ContentRequest req){
        User current=getCurrentUser();
        Content c=contentRepository.findById(id).orElseThrow(()->new RuntimeException("Content not found: "+id));
        if(!c.getCreatedBy().getId().equals(current.getId())) throw new RuntimeException("Permission denied");
        if(c.getStatus()!=ContentStatus.DRAFT&&c.getStatus()!=ContentStatus.REJECTED)
            throw new RuntimeException("Only DRAFT or REJECTED content can be edited");
        c.setTitle(req.getTitle());c.setDescription(req.getDescription());
        c.setContentType(req.getContentType());c.setBody(req.getBody());c.setMediaUrl(req.getMediaUrl());
        c.setTags(req.getTags()!=null?req.getTags().toString():null);
        return ContentResponse.fromEntity(contentRepository.save(c));
    }

    @Transactional
    public ContentResponse submitForReview(Long id){
        User current=getCurrentUser();
        Content c=contentRepository.findById(id).orElseThrow(()->new RuntimeException("Content not found: "+id));
        if(!c.getCreatedBy().getId().equals(current.getId())) throw new RuntimeException("Permission denied");
        if(c.getStatus()!=ContentStatus.DRAFT&&c.getStatus()!=ContentStatus.REJECTED)
            throw new RuntimeException("Content must be DRAFT or REJECTED to submit");
        c.setStatus(ContentStatus.UNDER_REVIEW);
        
        List<User> editors = userRepository.findByRole(Role.EDITOR);
        if (!editors.isEmpty()) {
            ApprovalWorkflow wf = ApprovalWorkflow.builder()
                .content(c)
                .assignedTo(editors.get(0))
                .stageOrder(1)
                .stageStatus(StageStatus.PENDING)
                .build();
            workflowRepository.save(wf);
        }
        
        return ContentResponse.fromEntity(contentRepository.save(c));
    }

    @Transactional
    public void deleteContent(Long id){
        User current=getCurrentUser();
        Content c=contentRepository.findById(id).orElseThrow(()->new RuntimeException("Content not found: "+id));
        if(!c.getCreatedBy().getId().equals(current.getId())) throw new RuntimeException("Permission denied");
        if(c.getStatus()!=ContentStatus.DRAFT) throw new RuntimeException("Only DRAFT content can be deleted");
        contentRepository.delete(c);
    }
}
