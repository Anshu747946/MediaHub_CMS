package com.example.mediaHub.dto.response;
import lombok.*;
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class MetricsResponse {
    private Long contentId,totalViews,totalLikes,totalShares,totalComments;
    private String contentTitle;
}
