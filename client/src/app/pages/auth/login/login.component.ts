import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertComponent } from '../../../shared/alert/alert.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private router = inject(Router);

    form = this.fb.group({
        email:    ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });

    loading = false;
    errorMsg = '';
    showPassword = false;

    get email()    { return this.form.get('email')!; }
    get password() { return this.form.get('password')!; }

    togglePassword(): void {
        this.showPassword = !this.showPassword;
    }

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.errorMsg = '';

        const { email, password } = this.form.value;

        this.auth.login(email!, password!).subscribe({
            next: (res) => {
                this.loading = false;
                // Role-based redirect
                if (res.user.role === 'restaurant') {
                    this.router.navigate(['/restaurant/dashboard']);
                } else {
                    this.router.navigate(['/ngo/dashboard']);
                }
            },
            error: (err) => {
                this.loading = false;
                this.errorMsg = err?.error?.message || 'Login failed. Please try again.';
            },
        });
    }
}
