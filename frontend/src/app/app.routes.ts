import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

/*
 * Every route referenced by ShellComponent's sidebar navigation MUST be
 * registered here as a child of the shell route. Previously "Team",
 * "Analytics", and "New content" pointed to paths with no matching route,
 * so Angular's Router fell through to the wildcard '**' route below,
 * which redirects to /login — this looked like being logged out, but was
 * actually just a 404 inside the app.
 */
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  {
    path: '',
    loadComponent: () => import('./features/shell/shell.component').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'creator',
        canActivate: [roleGuard(['CONTENT_CREATOR'])],
        loadComponent: () => import('./features/creator/creator-dashboard/creator-dashboard.component').then(m => m.CreatorDashboardComponent)
      },
      {
        path: 'editor',
        canActivate: [roleGuard(['EDITOR'])],
        loadComponent: () => import('./features/editor/editor-dashboard/editor-dashboard.component').then(m => m.EditorDashboardComponent)
      },
      {
        path: 'marketing',
        canActivate: [roleGuard(['MARKETING'])],
        loadComponent: () => import('./features/marketing/marketing-dashboard/marketing-dashboard.component').then(m => m.MarketingDashboardComponent)
      },
      {
        path: 'marketing/analytics',
        canActivate: [roleGuard(['MARKETING'])],
        loadComponent: () => import('./features/marketing/marketing-analytics/marketing-analytics.component').then(m => m.MarketingAnalyticsComponent)
      },
      {
        path: 'manager',
        canActivate: [roleGuard(['MANAGER', 'IT_SUPPORT'])],
        loadComponent: () => import('./features/manager/manager-dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent)
      },
      {
        path: 'manager/team',
        canActivate: [roleGuard(['MANAGER', 'IT_SUPPORT'])],
        loadComponent: () => import('./features/manager/manager-team/manager-team.component').then(m => m.ManagerTeamComponent)
      },
      {
        path: 'manager/system',
        canActivate: [roleGuard(['MANAGER', 'IT_SUPPORT'])],
        loadComponent: () => import('./features/manager/system-status/system-status.component').then(m => m.SystemStatusComponent)
      },
    ]
  },

  { path: '**', redirectTo: '/login' }
];
