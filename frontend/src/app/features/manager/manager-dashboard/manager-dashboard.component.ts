import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material/material.module';
import { MetricsService } from '../../../core/services/metrics.service';
import { ContentService } from '../../../core/services/content.service';
import { Content, DashboardResponse } from '../../../core/models/content.model';

interface BarItem { label: string; value: number; pct: number; color: string; }

/*
 * Manager "Overview" dashboard.
 * Case study requirement covered: "Monitor overall content performance,
 * track team activity, and generate reports."
 * Team activity itself lives on the dedicated Team page (manager-team).
 */
@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss'
})
export class ManagerDashboardComponent implements OnInit {
  dashboard = signal<DashboardResponse | null>(null);
  chartData = signal<BarItem[]>([]);
  recentContent = signal<Content[]>([]);
  loading = signal(true);

  constructor(private metricsSvc: MetricsService, private contentSvc: ContentService) {}

  ngOnInit() {
    this.loading.set(true);
    this.metricsSvc.getDashboard().subscribe({
      next: r => {
        const d = r.data;
        this.dashboard.set(d);
        const t = d.totalContent || 1;
        this.chartData.set([
          { label: 'Draft',        value: d.totalDraft,       pct: d.totalDraft / t * 100,       color: '#64748b' },
          { label: 'Under review', value: d.totalUnderReview, pct: d.totalUnderReview / t * 100, color: '#3b82f6' },
          { label: 'Approved',     value: d.totalApproved,    pct: d.totalApproved / t * 100,    color: '#22c55e' },
          { label: 'Published',    value: d.totalPublished,   pct: d.totalPublished / t * 100,   color: '#14b8a6' },
          { label: 'Rejected',     value: d.totalRejected,    pct: d.totalRejected / t * 100,    color: '#ef4444' },
        ]);
        this.contentSvc.getAllContent().subscribe(cr => {
          this.recentContent.set((cr.data ?? []).slice(0, 6));
          this.loading.set(false);
        });
      },
      error: () => this.loading.set(false)
    });
  }
}
