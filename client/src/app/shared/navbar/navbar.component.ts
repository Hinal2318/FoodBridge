import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, LogOut } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  get isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  get user() {
    return this.auth.currentUser();
  }

  readonly LogOut = LogOut;

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
