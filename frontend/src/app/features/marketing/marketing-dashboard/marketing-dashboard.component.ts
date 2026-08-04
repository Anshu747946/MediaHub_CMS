import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material/material.module';
import { ContentService } from '../../../core/services/content.service';
import { ChannelService } from '../../../core/services/channel.service';
import { Content } from '../../../core/models/content.model';
import { Channel } from '../../../core/models/channel.model';
import { DistributeDialogComponent } from '../distribute-dialog/distribute-dialog.component';

/*
 * Marketing dashboard.
 * Case study requirement covered: "Share content across channels, monitor
 * content performance, and analyze engagement metrics." (Analytics is a
 * separate page — see marketing-analytics.component.ts)
 */
@Component({
  selector: 'app-marketing-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './marketing-dashboard.component.html',
  styleUrl: './marketing-dashboard.component.scss'
})
export class MarketingDashboardComponent implements OnInit {
  approvedContent = signal<Content[]>([]);
  channels = signal<Channel[]>([]);
  publishedCount = signal(0);
  loading = signal(true);
  distributingId = signal<number | null>(null);

  constructor(
    private contentSvc: ContentService,
    private channelSvc: ChannelService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.contentSvc.getAllContent('APPROVED').subscribe({
      next: r => {
        this.approvedContent.set(r.data ?? []);
        this.contentSvc.getAllContent('PUBLISHED').subscribe(pr => {
          this.publishedCount.set((pr.data ?? []).length);
          this.channelSvc.getActiveChannels().subscribe(cr => {
            this.channels.set(cr.data ?? []);
            this.loading.set(false);
          });
        });
      },
      error: () => this.loading.set(false)
    });
  }

  openDistribute(item: Content) {
    const ref = this.dialog.open(DistributeDialogComponent, { data: { content: item }, width: '460px' });
    ref.afterClosed().subscribe((channelIds: number[] | undefined) => {
      if (!channelIds || channelIds.length === 0) return;
      this.distributingId.set(item.id);
      this.channelSvc.distribute(item.id, channelIds).subscribe({
        next: () => {
          this.distributingId.set(null);
          this.snack.open('Distributed successfully', 'Dismiss', { duration: 3500, panelClass: 'snack-success' });
          this.load();
        },
        error: e => {
          this.distributingId.set(null);
          this.snack.open(e.error?.message ?? 'Distribution failed', 'Dismiss', { duration: 4000, panelClass: 'snack-error' });
        }
      });
    });
  }
}
