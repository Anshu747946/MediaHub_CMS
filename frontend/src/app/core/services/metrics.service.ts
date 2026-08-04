import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/auth.model';
import { DashboardResponse, MetricsResponse } from '../models/content.model';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private readonly API = 'http://localhost:8080/api/metrics';
  constructor(private http: HttpClient) {}

  getDashboard() { return this.http.get<ApiResponse<DashboardResponse>>(`${this.API}/dashboard`); }
  getMetrics(contentId: number) { return this.http.get<ApiResponse<MetricsResponse>>(`${this.API}/${contentId}`); }
}
