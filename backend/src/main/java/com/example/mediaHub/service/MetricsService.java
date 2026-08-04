package com.example.mediaHub.service;
import com.example.mediaHub.dto.response.*;
import com.example.mediaHub.entity.Content;
import com.example.mediaHub.entity.enums.ContentStatus;
import com.example.mediaHub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor
public class MetricsService {
    private final EngagementMetricRepository metricsRepository;
    private final ContentRepository contentRepository;

    @Transactional(readOnly=true)
    public MetricsResponse getMetricsForContent(Long contentId){
        Content c=contentRepository.findById(contentId).orElseThrow(()->new RuntimeException("Content not found"));
        Long views=metricsRepository.sumViewsByContentId(contentId);
        Long likes=metricsRepository.sumLikesByContentId(contentId);
        Long shares=metricsRepository.sumSharesByContentId(contentId);
        Long comments=metricsRepository.sumCommentsByContentId(contentId);
        return MetricsResponse.builder().contentId(contentId).contentTitle(c.getTitle())
            .totalViews(views!=null?views:0L)
            .totalLikes(likes!=null?likes:0L)
            .totalShares(shares!=null?shares:0L)
            .totalComments(comments!=null?comments:0L)
            .build();
    }

    @Transactional(readOnly=true)
    public DashboardResponse getDashboard(){
        long draft=contentRepository.countByStatus(ContentStatus.DRAFT);
        long review=contentRepository.countByStatus(ContentStatus.UNDER_REVIEW);
        long approved=contentRepository.countByStatus(ContentStatus.APPROVED);
        long published=contentRepository.countByStatus(ContentStatus.PUBLISHED);
        long rejected=contentRepository.countByStatus(ContentStatus.REJECTED);
        return DashboardResponse.builder().totalDraft(draft).totalUnderReview(review)
            .totalApproved(approved).totalPublished(published).totalRejected(rejected)
            .totalContent(draft+review+approved+published+rejected).build();
    }
}
