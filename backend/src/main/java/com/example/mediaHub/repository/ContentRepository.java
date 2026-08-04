package com.example.mediaHub.repository;
import com.example.mediaHub.entity.Content;
import com.example.mediaHub.entity.enums.ContentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ContentRepository extends JpaRepository<Content,Long> {
    List<Content> findByCreatedById(Long userId);
    List<Content> findByStatus(ContentStatus status);
    List<Content> findByCreatedByIdAndStatus(Long userId, ContentStatus status);
    long countByStatus(ContentStatus status);
}
