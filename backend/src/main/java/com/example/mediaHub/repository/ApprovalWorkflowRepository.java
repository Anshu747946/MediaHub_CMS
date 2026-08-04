package com.example.mediaHub.repository;
import com.example.mediaHub.entity.ApprovalWorkflow;
import com.example.mediaHub.entity.enums.StageStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface ApprovalWorkflowRepository extends JpaRepository<ApprovalWorkflow,Long> {
    List<ApprovalWorkflow> findByContentIdOrderByStageOrderAsc(Long contentId);
    List<ApprovalWorkflow> findByAssignedToIdAndStageStatus(Long userId, StageStatus status);
    List<ApprovalWorkflow> findByStageStatus(StageStatus status);
    Optional<ApprovalWorkflow> findByContentIdAndStageStatus(Long contentId, StageStatus status);
}
