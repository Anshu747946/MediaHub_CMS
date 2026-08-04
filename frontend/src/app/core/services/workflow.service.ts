import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/auth.model';
import { WorkflowResponse, WorkflowActionRequest } from '../models/content.model';

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  private readonly API = 'http://localhost:8080/api/workflows';
  constructor(private http: HttpClient) {}

  getPending() { return this.http.get<ApiResponse<WorkflowResponse[]>>(`${this.API}/pending`); }
  getForContent(contentId: number) { return this.http.get<ApiResponse<WorkflowResponse[]>>(`${this.API}/content/${contentId}`); }
  takeAction(id: number, r: WorkflowActionRequest) {
    return this.http.post<ApiResponse<WorkflowResponse>>(`${this.API}/${id}/action`, r);
  }
}
