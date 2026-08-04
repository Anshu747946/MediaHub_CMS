import { Component, OnInit, ViewChild, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../shared/material/material.module';
import { UserService } from '../../../core/services/user.service';
import { ContentService } from '../../../core/services/content.service';
import { UserResponse } from '../../../core/models/user.model';
import { Role } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';

interface TeamMember extends UserResponse {
  contentCount: number;
  updatingRole: boolean;
  togglingStatus: boolean;
  deleting: boolean;
}

@Component({
  selector: 'app-manager-team',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './manager-team.component.html',
  styleUrl: './manager-team.component.scss'
})
export class ManagerTeamComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['username', 'role', 'contentCount', 'status', 'joined', 'actions'];
  dataSource = new MatTableDataSource<TeamMember>([]);
  loading = signal(true);
  roleCounts = signal<Partial<Record<string, number>>>({});
  filterValue = '';

  readonly roleOptions: Role[] = ['CONTENT_CREATOR', 'EDITOR', 'MARKETING', 'MANAGER', 'IT_SUPPORT'];
  readonly roleLabels: Record<string, string> = {
    CONTENT_CREATOR: 'Content Creator',
    EDITOR: 'Editor',
    MARKETING: 'Marketing',
    MANAGER: 'Manager',
    IT_SUPPORT: 'IT Support',
  };

  currentUserId: number | null = null;

  constructor(
    private userSvc: UserService,
    private contentSvc: ContentService,
    private snack: MatSnackBar,
    private authSvc: AuthService,
  ) {}

  ngOnInit() {
    const stored = localStorage.getItem('mediahub_user');
    if (stored) { try { this.currentUserId = JSON.parse(stored).userId ?? null; } catch { } }
    this.load();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(value: string) {
    this.filterValue = value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  load() {
    this.loading.set(true);
    this.userSvc.getAllUsers().subscribe({
      next: uRes => {
        const users = uRes.data ?? [];
        this.contentSvc.getAllContent().subscribe({
          next: cRes => {
            const content = cRes.data ?? [];
            const members: TeamMember[] = users.map(u => ({
              ...u,
              contentCount: content.filter(c => c.createdByName === u.username).length,
              updatingRole: false,
              togglingStatus: false,
              deleting: false,
            }));
            this.dataSource.data = members;

            const counts: Record<string, number> = {};
            users.forEach(u => { counts[u.role] = (counts[u.role] ?? 0) + 1; });
            this.roleCounts.set(counts);
            this.loading.set(false);
          },
          error: () => {
            this.dataSource.data = users.map(u => ({ ...u, contentCount: 0, updatingRole: false, togglingStatus: false, deleting: false }));
            this.loading.set(false);
          }
        });
      },
      error: () => this.loading.set(false)
    });
  }

  onRoleChange(member: TeamMember, newRole: string) {
    if (!newRole || newRole === member.role) return;
    member.updatingRole = true;
    this.userSvc.updateRole(member.id, newRole as Role).subscribe({
      next: res => {
        member.role = res.data?.role ?? (newRole as Role);
        member.updatingRole = false;
        this.recalcCounts();
        this.snack.open(`✅ ${member.username}'s role updated to ${this.roleLabels[member.role]}`, 'Close', { duration: 3500 });
      },
      error: e => {
        member.updatingRole = false;
        this.snack.open(`❌ Failed: ${e.error?.message ?? 'Could not update role'}`, 'Close', { duration: 4000 });
      }
    });
  }

  toggleStatus(member: TeamMember) {
    member.togglingStatus = true;
    const newStatus = !member.isActive;
    this.userSvc.updateStatus(member.id, newStatus).subscribe({
      next: () => {
        member.isActive = newStatus;
        member.togglingStatus = false;
        const label = newStatus ? 'activated' : 'deactivated';
        this.snack.open(`✅ ${member.username} has been ${label}`, 'Close', { duration: 3500 });
      },
      error: e => {
        member.togglingStatus = false;
        this.snack.open(`❌ Failed: ${e.error?.message ?? 'Could not update status'}`, 'Close', { duration: 4000 });
      }
    });
  }

  deleteUser(member: TeamMember) {
    if (!confirm(`Are you sure you want to permanently delete "${member.username}"? This cannot be undone.`)) return;
    member.deleting = true;
    this.userSvc.deleteUser(member.id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(m => m.id !== member.id);
        this.recalcCounts();
        this.snack.open(`🗑️ ${member.username} has been deleted`, 'Close', { duration: 3500 });
      },
      error: e => {
        member.deleting = false;
        this.snack.open(`❌ Failed: ${e.error?.message ?? 'Could not delete user'}`, 'Close', { duration: 4000 });
      }
    });
  }

  isSelf(member: TeamMember): boolean {
    return member.id === this.currentUserId;
  }

  private recalcCounts() {
    const counts: Record<string, number> = {};
    this.dataSource.data.forEach(u => { counts[u.role] = (counts[u.role] ?? 0) + 1; });
    this.roleCounts.set(counts);
  }
}
