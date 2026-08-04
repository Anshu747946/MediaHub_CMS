import { ContentStatus, ContentType } from './auth.model';

export interface Content {
  id: number; title: string; description: string; contentType: ContentType;
  status: ContentStatus; body: string; mediaUrl: string; tags: string;
  createdById: number; createdByName: string;
  scheduledAt: string; publishedAt: string; createdAt: string; updatedAt: string;
}
export interface ContentRequest {
  title: string; description?: string; contentType: ContentType; body?: string; mediaUrl?: string;
}
export interface WorkflowResponse {
  id: number; contentId: number; contentTitle: string;
  assignedToId: number; assignedToName: string; stageOrder: number;
  stageStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  comments: string; actionedAt: string; createdAt: string;
}
export interface WorkflowActionRequest { decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED'; comments?: string; }
export interface DashboardResponse {
  totalDraft: number; totalUnderReview: number; totalApproved: number;
  totalPublished: number; totalRejected: number; totalContent: number;
}
export interface MetricsResponse {
  contentId: number; contentTitle: string;
  totalViews: number; totalLikes: number; totalShares: number; totalComments: number;
}
