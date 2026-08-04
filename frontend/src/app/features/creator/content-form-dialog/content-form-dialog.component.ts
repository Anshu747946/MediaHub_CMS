import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../shared/material/material.module';
import { Content, ContentRequest } from '../../../core/models/content.model';

export interface DialogData { content?: Content; viewOnly?: boolean; }

@Component({
  selector: 'app-content-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './content-form-dialog.component.html',
  styleUrl: './content-form-dialog.component.scss'
})
export class ContentFormDialogComponent {
  form = this.fb.group({
    title:       [this.data.content?.title       ?? '', [Validators.required, Validators.maxLength(500)]],
    contentType: [this.data.content?.contentType ?? 'ARTICLE', Validators.required],
    description: [this.data.content?.description ?? ''],
    body:        [this.data.content?.body        ?? ''],
    mediaUrl:    [this.data.content?.mediaUrl    ?? ''],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ContentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (this.data.viewOnly) {
      this.form.disable();
    }
  }

  submit() {
    if (this.form.invalid) return;
    const req: ContentRequest = {
      title:       this.form.value.title!,
      contentType: this.form.value.contentType as any,
      description: this.form.value.description ?? undefined,
      body:        this.form.value.body        ?? undefined,
      mediaUrl:    this.form.value.mediaUrl    ?? undefined,
    };
    this.dialogRef.close(req);
  }
}
