import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material/material.module';
import { ChannelService } from '../../../core/services/channel.service';
import { Channel } from '../../../core/models/channel.model';
import { MatSnackBar } from '@angular/material/snack-bar';

/*
 * NEW page for IT_SUPPORT (also reachable by Manager).
 * Case study requirement covered: "IT Support: Ensures data security,
 * integration with third-party platforms, and system uptime."
 * Shows every distribution channel's connection status and does a live
 * ping of the backend API to report uptime, since IT Support has no
 * content-editing responsibilities of their own in the case study.
 */
@Component({
  selector: 'app-system-status',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './system-status.component.html',
  styleUrl: './system-status.component.scss'
})
export class SystemStatusComponent implements OnInit {
  channels = signal<Channel[]>([]);
  loading = signal(true);
  apiOnline = signal<boolean | null>(null);
  checkedAt = signal<Date | null>(null);

  constructor(private channelSvc: ChannelService, private snack: MatSnackBar) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.channelSvc.getAll().subscribe({
      next: r => {
        this.channels.set(r.data ?? []);
        this.apiOnline.set(true);
        this.checkedAt.set(new Date());
        this.loading.set(false);
      },
      error: () => {
        this.apiOnline.set(false);
        this.checkedAt.set(new Date());
        this.loading.set(false);
      }
    });
  }

  toggleStatus(channel: Channel, isActive: boolean) {
    // Optimistic UI update
    const previous = channel.isActive;
    channel.isActive = isActive;
    
    this.channelSvc.updateStatus(channel.id, isActive).subscribe({
      next: () => {
        this.snack.open(`Channel ${isActive ? 'enabled' : 'disabled'}`, 'Dismiss', { duration: 3000, panelClass: 'snack-success' });
      },
      error: () => {
        channel.isActive = previous;
        this.snack.open('Failed to update channel status', 'Dismiss', { duration: 3000, panelClass: 'snack-error' });
      }
    });
  }
}
