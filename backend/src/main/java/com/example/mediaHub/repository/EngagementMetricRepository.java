package com.example.mediaHub.repository;
import com.example.mediaHub.entity.EngagementMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface EngagementMetricRepository extends JpaRepository<EngagementMetric,Long> {
    List<EngagementMetric> findByContentId(Long contentId);
    @Query("SELECT SUM(e.views) FROM EngagementMetric e WHERE e.content.id=:contentId")
    Long sumViewsByContentId(@Param("contentId") Long contentId);
    @Query("SELECT SUM(e.likes) FROM EngagementMetric e WHERE e.content.id=:contentId")
    Long sumLikesByContentId(@Param("contentId") Long contentId);
    @Query("SELECT SUM(e.shares) FROM EngagementMetric e WHERE e.content.id=:contentId")
    Long sumSharesByContentId(@Param("contentId") Long contentId);
    @Query("SELECT SUM(e.commentsCount) FROM EngagementMetric e WHERE e.content.id=:contentId")
    Long sumCommentsByContentId(@Param("contentId") Long contentId);
}
