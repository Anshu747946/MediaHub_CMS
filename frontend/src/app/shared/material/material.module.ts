import { NgModule } from '@angular/core';
import { MatSidenavModule }         from '@angular/material/sidenav';
import { MatToolbarModule }         from '@angular/material/toolbar';
import { MatListModule }            from '@angular/material/list';
import { MatIconModule }            from '@angular/material/icon';
import { MatButtonModule }          from '@angular/material/button';
import { MatCardModule }            from '@angular/material/card';
import { MatTableModule }           from '@angular/material/table';
import { MatPaginatorModule }       from '@angular/material/paginator';
import { MatSortModule }            from '@angular/material/sort';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatSelectModule }          from '@angular/material/select';
import { MatDialogModule }          from '@angular/material/dialog';
import { MatSnackBarModule }        from '@angular/material/snack-bar';
import { MatChipsModule }           from '@angular/material/chips';
import { MatBadgeModule }           from '@angular/material/badge';
import { MatProgressBarModule }     from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule }            from '@angular/material/menu';
import { MatTooltipModule }         from '@angular/material/tooltip';
import { MatDividerModule }         from '@angular/material/divider';
import { MatSlideToggleModule }     from '@angular/material/slide-toggle';

const M = [
  MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule,
  MatButtonModule, MatCardModule, MatTableModule, MatPaginatorModule,
  MatSortModule, MatFormFieldModule, MatInputModule, MatSelectModule,
  MatDialogModule, MatSnackBarModule, MatChipsModule, MatBadgeModule,
  MatProgressBarModule, MatProgressSpinnerModule, MatMenuModule,
  MatTooltipModule, MatDividerModule, MatSlideToggleModule,
];

@NgModule({ imports: M, exports: M })
export class MaterialModule {}
