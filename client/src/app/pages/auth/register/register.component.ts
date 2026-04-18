import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertComponent } from '../../../shared/alert/alert.component';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private router = inject(Router);

    form = this.fb.group({
        name:     ['', [Validators.required, Validators.minLength(2)]],
        email:    ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        role:     ['', Validators.required],
        location: ['', Validators.required],
    });

    loading = false;
    errorMsg = '';
    successMsg = '';
    showPassword = false;

    get name()     { return this.form.get('name')!; }
    get email()    { return this.form.get('email')!; }
    get password() { return this.form.get('password')!; }
    get role()     { return this.form.get('role')!; }
    get location() { return this.form.get('location')!; }

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
        this.successMsg = '';

        const { name, email, password, role, location } = this.form.value;

        this.auth.register({ name: name!, email: email!, password: password!, role: role!, location: location! }).subscribe({
            next: () => {
                this.loading = false;
                this.successMsg = 'Account created! Redirecting to login…';
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 1500);
            },
            error: (err) => {
                this.loading = false;
                this.errorMsg = err?.error?.message || 'Registration failed. Please try again.';
            },
        });
    }
}
