import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material/material.module';
import { WorkflowService } from '../../../core/services/workflow.service';
import { WorkflowResponse } from '../../../core/models/content.model';
import { ActionDialogComponent } from '../action-dialog/action-dialog.component';
import { ContentPreviewDialogComponent } from '../content-preview-dialog/content-preview-dialog.component';

/*
 * Editor dashboard.
 * Case study requirement covered: "Review, approve, and schedule content for
 * publication. Track content progress through the approval workflow."
 * Editors can preview the full content (not just the title) before deciding,
 * and every rejection/changes-requested decision requires written comments.
 */
@Component({
  selector: 'app-editor-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './editor-dashboard.component.html',
  styleUrl: './editor-dashboard.component.scss'
})
export class EditorDashboardComponent implements OnInit {
  workflows = signal<WorkflowResponse[]>([]);
  loading = signal(true);
  sessionApproved = signal(0);
  sessionTotal = signal(0);

  constructor(
    private workflowSvc: WorkflowService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.workflowSvc.getPending().subscribe({
      next: r => { this.workflows.set(r.data ?? []); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  previewContent(wf: WorkflowResponse) {
    this.dialog.open(ContentPreviewDialogComponent, { data: { contentId: wf.contentId }, width: '640px' });
  }

  openAction(wf: WorkflowResponse, decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED') {
    const ref = this.dialog.open(ActionDialogComponent, { data: { workflow: wf, decision }, width: '480px' });
    ref.afterClosed().subscribe(comments => {
      if (comments === undefined) return;
      this.workflowSvc.takeAction(wf.id, { decision, comments }).subscribe({
        next: () => {
          if (decision === 'APPROVED') this.sessionApproved.update(v => v + 1);
          this.sessionTotal.update(v => v + 1);
          this.snack.open(
            decision === 'APPROVED' ? 'Content approved' : decision === 'REJECTED' ? 'Content rejected' : 'Changes requested',
            'Dismiss', { duration: 3500, panelClass: 'snack-success' }
          );
          this.load();
        },
        error: e => this.snack.open(e.error?.message ?? 'Action failed', 'Dismiss', { duration: 4000, panelClass: 'snack-error' })
      });
    });
  }
}
