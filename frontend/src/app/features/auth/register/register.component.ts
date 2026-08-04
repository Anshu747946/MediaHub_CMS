import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../../shared/material/material.module';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MaterialModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
  });
  error   = signal<string | null>(null);
  loading = signal(false);
  showPw  = signal(false);

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true); this.error.set(null);
    const { username, email, password } = this.form.value;
    this.auth.register(username!, email!, password!, 'CONTENT_CREATOR' as Role).subscribe({
      next: () => this.loading.set(false),
      error: e  => { this.loading.set(false); this.error.set(e.error?.message ?? 'Registration failed'); }
    });
  }
}
