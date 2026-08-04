import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/auth.model';
import { Channel } from '../models/channel.model';

@Injectable({ providedIn: 'root' })
export class ChannelService {
  private readonly API = 'http://localhost:8080/api/channels';
  constructor(private http: HttpClient) {}

  getActiveChannels() { return this.http.get<ApiResponse<Channel[]>>(this.API); }
  getAll() { return this.http.get<ApiResponse<Channel[]>>(`${this.API}/all`); }
  updateStatus(id: number, isActive: boolean) {
    return this.http.put<ApiResponse<Channel>>(`${this.API}/${id}/status`, { isActive });
  }

  distribute(contentId: number, channelIds: number[]) {
    return this.http.post<ApiResponse<any[]>>(`${this.API}/distribute/${contentId}`, { channelIds });
  }
}
