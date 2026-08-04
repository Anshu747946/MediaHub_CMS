import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MaterialModule } from '../../shared/material/material.module';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/auth.model';

interface NavItem { icon: string; label: string; route: string; }

/*
 * ShellComponent is the persistent app frame — sidebar + topbar — shared by
 * every role. Its <router-outlet> renders whichever dashboard the current
 * route resolves to.
 *
 * IMPORTANT: every route referenced in roleNav below MUST exist as a real
 * child route in app.routes.ts. A nav item pointing to a route that isn't
 * registered falls through to the app's wildcard '**' route, which redirects
 * to /login — this was the bug reported (clicking "Team" logged the user out
 * visually because /manager/team didn't exist).
 */
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MaterialModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  constructor(public auth: AuthService, private router: Router) {}

  // Every route listed here exists in app.routes.ts as a child of the shell route.
  private roleNav: Record<Role, NavItem[]> = {
    CONTENT_CREATOR: [
      { icon: 'dashboard',   label: 'My Content',    route: '/creator' },
    ],
    EDITOR: [
      { icon: 'rate_review', label: 'Review Queue',  route: '/editor' },
    ],
    MARKETING: [
      { icon: 'campaign',    label: 'Distribution',  route: '/marketing' },
      { icon: 'bar_chart',   label: 'Analytics',     route: '/marketing/analytics' },
    ],
    MANAGER: [
      { icon: 'insights',    label: 'Overview',      route: '/manager' },
      { icon: 'people',      label: 'Team',          route: '/manager/team' },
      { icon: 'settings',    label: 'System',        route: '/manager/system' },
    ],
    IT_SUPPORT: [
      { icon: 'settings',    label: 'System',        route: '/manager/system' },
      { icon: 'people',      label: 'Team',          route: '/manager/team' },
    ],
  };

  private pageTitles: Record<string, string> = {
    '/creator':            'My Content',
    '/editor':             'Review Queue',
    '/marketing':          'Distribution',
    '/marketing/analytics':'Analytics',
    '/manager':            'Overview',
    '/manager/team':       'Team',
    '/manager/system':     'System Status',
  };

  private roleColors: Record<Role, string> = {
    CONTENT_CREATOR: '#6366f1',
    EDITOR:          '#f59e0b',
    MARKETING:       '#14b8a6',
    MANAGER:         '#a855f7',
    IT_SUPPORT:      '#22c55e',
  };

  navItems  = computed(() => this.roleNav[this.auth.userRole()!] ?? []);
  initials  = computed(() => (this.auth.currentUser()?.username ?? '??').slice(0, 2).toUpperCase());
  roleName  = computed(() => (this.auth.userRole() ?? '').replace(/_/g, ' '));
  pageTitle = computed(() => this.pageTitles[this.router.url] ?? 'Dashboard');

  get roleColor() { return this.roleColors[this.auth.userRole()!] ?? '#6366f1'; }

  logout() { this.auth.logout(); }
}
