import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../shared/material/material.module';
import { WorkflowResponse } from '../../../core/models/content.model';

export interface ActionDialogData {
  workflow: WorkflowResponse;
  decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
}

@Component({
  selector: 'app-action-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './action-dialog.component.html',
  styleUrl: './action-dialog.component.scss'
})
export class ActionDialogComponent {
  comments = '';
  error = signal<string | null>(null);

  constructor(
    public dialogRef: MatDialogRef<ActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ActionDialogData
  ) {}

  confirm() {
    if (this.data.decision !== 'APPROVED' && !this.comments.trim()) {
      this.error.set('Comments are required for this decision');
      return;
    }
    this.dialogRef.close(this.comments);
  }
}
