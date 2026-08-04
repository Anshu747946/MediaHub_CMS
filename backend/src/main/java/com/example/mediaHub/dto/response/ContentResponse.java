package com.example.mediaHub.dto.response;
import com.example.mediaHub.entity.Content;
import com.example.mediaHub.entity.enums.ContentStatus;
import com.example.mediaHub.entity.enums.ContentType;
import lombok.*;
import java.time.LocalDateTime;
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class ContentResponse {
    private Long id;
    private String title,description,body,mediaUrl,tags,createdByName;
    private Long createdById;
    private ContentType contentType;
    private ContentStatus status;
    private LocalDateTime scheduledAt,publishedAt,createdAt,updatedAt;
    public static ContentResponse fromEntity(Content c){
        return ContentResponse.builder().id(c.getId()).title(c.getTitle()).description(c.getDescription())
            .contentType(c.getContentType()).status(c.getStatus()).body(c.getBody()).mediaUrl(c.getMediaUrl())
            .tags(c.getTags()).createdById(c.getCreatedBy().getId()).createdByName(c.getCreatedBy().getUsername())
            .scheduledAt(c.getScheduledAt()).publishedAt(c.getPublishedAt()).createdAt(c.getCreatedAt()).updatedAt(c.getUpdatedAt()).build();
    }
}
