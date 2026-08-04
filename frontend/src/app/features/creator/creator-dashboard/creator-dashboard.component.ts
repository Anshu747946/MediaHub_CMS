import { Component, OnInit, AfterViewInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material/material.module';
import { ContentService } from '../../../core/services/content.service';
import { Content } from '../../../core/models/content.model';
import { ContentFormDialogComponent } from '../content-form-dialog/content-form-dialog.component';

/*
 * Content Creator dashboard.
 * Case study requirement covered: "Ability to upload and edit content,
 * track content status, and collaborate with editors."
 * Full CRUD: Create (dialog), Read (table), Update (dialog, DRAFT/REJECTED
 * only), Delete (DRAFT only) — matching the state machine enforced server-side.
 */
@Component({
  selector: 'app-creator-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './creator-dashboard.component.html',
  styleUrl: './creator-dashboard.component.scss'
})
export class CreatorDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['title', 'status', 'createdAt', 'updatedAt', 'actions'];
  dataSource = new MatTableDataSource<Content>([]);
  loading = signal(true);
  stats   = signal({ total: 0, draft: 0, review: 0, published: 0 });

  constructor(
    private contentSvc: ContentService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit() { this.load(); }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  load() {
    this.loading.set(true);
    this.contentSvc.getMyContent().subscribe({
      next: r => {
        this.dataSource.data = r.data ?? [];
        this.stats.set({
          total:     r.data.length,
          draft:     r.data.filter(c => c.status === 'DRAFT').length,
          review:    r.data.filter(c => c.status === 'UNDER_REVIEW').length,
          published: r.data.filter(c => c.status === 'PUBLISHED').length,
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  filterStatus(status: string) {
    this.dataSource.filter = status.trim().toLowerCase();
    this.dataSource.filterPredicate = (data, filter) =>
      !filter || data.status.toLowerCase() === filter.toLowerCase();
  }

  openCreateDialog() {
    const ref = this.dialog.open(ContentFormDialogComponent, { data: {}, width: '600px' });
    ref.afterClosed().subscribe(req => {
      if (!req) return;
      this.contentSvc.createContent(req).subscribe({
        next: () => { this.showSnack('Draft created successfully', 'snack-success'); this.load(); },
        error: e => this.showSnack(e.error?.message ?? 'Failed to create', 'snack-error')
      });
    });
  }

  openEditDialog(content: Content) {
    const ref = this.dialog.open(ContentFormDialogComponent, { data: { content }, width: '600px' });
    ref.afterClosed().subscribe(req => {
      if (!req) return;
      this.contentSvc.updateContent(content.id, req).subscribe({
        next: () => { this.showSnack('Content updated', 'snack-success'); this.load(); },
        error: e => this.showSnack(e.error?.message ?? 'Update failed', 'snack-error')
      });
    });
  }

  openViewDialog(content: Content) {
    this.dialog.open(ContentFormDialogComponent, { data: { content, viewOnly: true }, width: '600px' });
  }

  submitForReview(content: Content) {
    this.contentSvc.submitForReview(content.id).subscribe({
      next: () => { this.showSnack('Submitted for review', 'snack-success'); this.load(); },
      error: e => this.showSnack(e.error?.message ?? 'Submit failed', 'snack-error')
    });
  }

  deleteContent(content: Content) {
    if (!confirm(`Delete "${content.title}"? This cannot be undone.`)) return;
    this.contentSvc.deleteContent(content.id).subscribe({
      next: () => { this.showSnack('Draft deleted', 'snack-success'); this.load(); },
      error: e => this.showSnack(e.error?.message ?? 'Delete failed', 'snack-error')
    });
  }

  private showSnack(msg: string, panelClass: string) {
    this.snack.open(msg, 'Dismiss', { duration: 4000, panelClass });
  }
}
