import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse, ContentStatus } from '../models/auth.model';
import { Content, ContentRequest } from '../models/content.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly API = 'http://localhost:8080/api';
  constructor(private http: HttpClient) {}

  getMyContent()                     { return this.http.get<ApiResponse<Content[]>>(`${this.API}/content/my`); }
  getContentById(id: number)         { return this.http.get<ApiResponse<Content>>(`${this.API}/content/${id}`); }
  createContent(r: ContentRequest)   { return this.http.post<ApiResponse<Content>>(`${this.API}/content`, r); }
  updateContent(id: number, r: ContentRequest) { return this.http.put<ApiResponse<Content>>(`${this.API}/content/${id}`, r); }
  submitForReview(id: number)        { return this.http.post<ApiResponse<Content>>(`${this.API}/content/${id}/submit`, {}); }
  deleteContent(id: number)          { return this.http.delete<ApiResponse<void>>(`${this.API}/content/${id}`); }

  getAllContent(status?: ContentStatus) {
    let p = new HttpParams();
    if (status) p = p.set('status', status);
    return this.http.get<ApiResponse<Content[]>>(`${this.API}/content`, { params: p });
  }
}
