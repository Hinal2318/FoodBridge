import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('foodbridge-client');
  auth = inject(AuthService);
  router = inject(Router);

  get isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  get isAuthPage() {
    return this.router.url === '/login' || this.router.url === '/register';
  }
}

