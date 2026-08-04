import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material/material.module';
import { ContentService } from '../../../core/services/content.service';
import { MetricsService } from '../../../core/services/metrics.service';
import { Content, MetricsResponse } from '../../../core/models/content.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ContentWithMetrics extends Content {
  metrics?: MetricsResponse;
}

@Component({
  selector: 'app-marketing-analytics',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './marketing-analytics.component.html',
  styleUrl: './marketing-analytics.component.scss'
})
export class MarketingAnalyticsComponent implements OnInit {
  content = signal<ContentWithMetrics[]>([]);
  loading = signal(true);

  // Aggregate stats
  totalViews = signal(0);
  totalLikes = signal(0);
  totalShares = signal(0);
  totalComments = signal(0);
  engagementRate = signal(0);

  constructor(private contentSvc: ContentService, private metricsSvc: MetricsService) {}

  ngOnInit() {
    this.loading.set(true);
    this.contentSvc.getAllContent('PUBLISHED').subscribe({
      next: r => {
        const publishedContent = r.data ?? [];
        if (publishedContent.length === 0) {
          this.content.set([]);
          this.loading.set(false);
          return;
        }

        // Fetch all metrics in parallel
        const metricRequests = publishedContent.map(item => 
          this.metricsSvc.getMetrics(item.id).pipe(
            catchError(() => of(null)) // if one fails, just return null so forkJoin doesn't break
          )
        );

        forkJoin(metricRequests).subscribe(metricResponses => {
          let tViews = 0, tLikes = 0, tShares = 0, tComments = 0;
          
          const combined: ContentWithMetrics[] = publishedContent.map((item, i) => {
            const mData = metricResponses[i]?.data;
            if (mData) {
              tViews += mData.totalViews;
              tLikes += mData.totalLikes;
              tShares += mData.totalShares;
              tComments += mData.totalComments;
            }
            return { ...item, metrics: mData };
          });

          // Sort by highest views descending
          combined.sort((a, b) => {
            const viewsA = a.metrics?.totalViews ?? 0;
            const viewsB = b.metrics?.totalViews ?? 0;
            return viewsB - viewsA;
          });

          this.totalViews.set(tViews);
          this.totalLikes.set(tLikes);
          this.totalShares.set(tShares);
          this.totalComments.set(tComments);
          
          const totalEngagements = tLikes + tShares + tComments;
          this.engagementRate.set(tViews > 0 ? (totalEngagements / tViews) * 100 : 0);
          
          this.content.set(combined);
          this.loading.set(false);
        });
      },
      error: () => this.loading.set(false)
    });
  }
}
