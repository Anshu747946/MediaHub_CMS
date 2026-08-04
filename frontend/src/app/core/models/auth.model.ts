export type Role = 'CONTENT_CREATOR' | 'EDITOR' | 'MARKETING' | 'MANAGER' | 'IT_SUPPORT';
export type ContentStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'SCHEDULED' | 'PUBLISHED' | 'REJECTED';
export type ContentType = 'ARTICLE' | 'VIDEO' | 'PODCAST' | 'IMAGE';

export interface ApiResponse<T> { success: boolean; message: string; data: T; }
export interface AuthResponse { token: string; email: string; username: string; role: Role; userId: number; }
export interface CurrentUser { token: string; email: string; username: string; role: Role; userId: number; }
