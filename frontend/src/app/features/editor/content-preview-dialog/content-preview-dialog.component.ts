import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../shared/material/material.module';
import { ContentService } from '../../../core/services/content.service';
import { Content } from '../../../core/models/content.model';

export interface PreviewDialogData { contentId: number; }

/*
 * NEW component addressing a gap: the editor's review queue previously only
 * showed a title. The case study requires editors to actually "review...
 * content", so this dialog fetches and displays the full content body
 * (via GET /api/content/{id}, which any authenticated user may call) before
 * the editor makes an approve/reject decision.
 */
@Component({
  selector: 'app-content-preview-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './content-preview-dialog.component.html',
  styleUrl: './content-preview-dialog.component.scss'
})
export class ContentPreviewDialogComponent implements OnInit {
  content = signal<Content | null>(null);
  loading = signal(true);

  constructor(
    public dialogRef: MatDialogRef<ContentPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PreviewDialogData,
    private contentSvc: ContentService
  ) {}

  ngOnInit() {
    this.contentSvc.getContentById(this.data.contentId).subscribe({
      next: r => { this.content.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
