import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../shared/material/material.module';
import { ChannelService } from '../../../core/services/channel.service';
import { Channel } from '../../../core/models/channel.model';
import { Content } from '../../../core/models/content.model';

export interface DistributeDialogData { content: Content; }

/*
 * NEW component replacing the previous "always distribute to all 4 channels"
 * shortcut. The case study requires marketing to "share content across
 * channels" deliberately — this dialog lets them pick exactly which
 * channels to push to, matching /api/channels/distribute/{id} which already
 * accepts an arbitrary channelIds list.
 */
@Component({
  selector: 'app-distribute-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './distribute-dialog.component.html',
  styleUrl: './distribute-dialog.component.scss'
})
export class DistributeDialogComponent implements OnInit {
  channels = signal<Channel[]>([]);
  selected = signal<Set<number>>(new Set());
  loading = signal(true);

  constructor(
    public dialogRef: MatDialogRef<DistributeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DistributeDialogData,
    private channelSvc: ChannelService
  ) {}

  ngOnInit() {
    this.channelSvc.getActiveChannels().subscribe({
      next: r => {
        this.channels.set(r.data ?? []);
        // Pre-select all channels by default — user can uncheck any they don't want
        this.selected.set(new Set((r.data ?? []).map(c => c.id)));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  toggle(id: number) {
    const s = new Set(this.selected());
    s.has(id) ? s.delete(id) : s.add(id);
    this.selected.set(s);
  }

  isSelected(id: number) { return this.selected().has(id); }

  confirm() {
    if (this.selected().size === 0) return;
    this.dialogRef.close(Array.from(this.selected()));
  }
}
