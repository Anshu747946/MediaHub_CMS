package com.example.mediaHub.dto.response;
import lombok.*;
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class DashboardResponse {
    private long totalDraft,totalUnderReview,totalApproved,totalPublished,totalRejected,totalContent;
}
