package com.example.mediaHub.controller;
import com.example.mediaHub.dto.request.ContentRequest;
import com.example.mediaHub.dto.response.*;
import com.example.mediaHub.entity.enums.ContentStatus;
import com.example.mediaHub.service.ContentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/content") @RequiredArgsConstructor
public class ContentController {
    private final ContentService contentService;
    @PostMapping @PreAuthorize("hasRole('CONTENT_CREATOR')")
    public ResponseEntity<ApiResponse<ContentResponse>> create(@Valid @RequestBody ContentRequest req){
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created",contentService.createContent(req)));
    }
    @GetMapping("/my") @PreAuthorize("hasRole('CONTENT_CREATOR')")
    public ResponseEntity<ApiResponse<List<ContentResponse>>> getMyContent(){
        return ResponseEntity.ok(ApiResponse.success("OK",contentService.getMyContent()));
    }
    @GetMapping @PreAuthorize("hasAnyRole('EDITOR','MANAGER','IT_SUPPORT','MARKETING')")
    public ResponseEntity<ApiResponse<List<ContentResponse>>> getAll(@RequestParam(required=false) ContentStatus status){
        List<ContentResponse> data=status!=null?contentService.getContentByStatus(status):contentService.getAllContent();
        return ResponseEntity.ok(ApiResponse.success("OK",data));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContentResponse>> getById(@PathVariable Long id){
        return ResponseEntity.ok(ApiResponse.success("OK",contentService.getContentById(id)));
    }
    @PutMapping("/{id}") @PreAuthorize("hasRole('CONTENT_CREATOR')")
    public ResponseEntity<ApiResponse<ContentResponse>> update(@PathVariable Long id,@Valid @RequestBody ContentRequest req){
        return ResponseEntity.ok(ApiResponse.success("Updated",contentService.updateContent(id,req)));
    }
    @PostMapping("/{id}/submit") @PreAuthorize("hasRole('CONTENT_CREATOR')")
    public ResponseEntity<ApiResponse<ContentResponse>> submit(@PathVariable Long id){
        return ResponseEntity.ok(ApiResponse.success("Submitted",contentService.submitForReview(id)));
    }
    @DeleteMapping("/{id}") @PreAuthorize("hasRole('CONTENT_CREATOR')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id){
        contentService.deleteContent(id);return ResponseEntity.ok(ApiResponse.success("Deleted",null));
    }
}
