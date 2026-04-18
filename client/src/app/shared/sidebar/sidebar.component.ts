import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, LayoutDashboard, Search, ClipboardList, Package, PlusCircle } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  auth = inject(AuthService);

  get role() {
    return this.auth.getRole();
  }

  getLinks() {
    if (this.role === 'ngo') {
      return [
        { path: '/ngo/dashboard',        label: 'Dashboard',      icon: LayoutDashboard },
        { path: '/ngo/available-food',   label: 'Available Food', icon: Search          },
        { path: '/ngo/requests',         label: 'My Requests',    icon: ClipboardList   }
      ];
    } else if (this.role === 'restaurant') {
      return [
        { path: '/restaurant/dashboard', label: 'Dashboard',      icon: LayoutDashboard },
        { path: '/restaurant/add-food',  label: 'Add Food',       icon: PlusCircle      },
        { path: '/restaurant/food-list', label: 'My Listings',    icon: Package         },
        { path: '/restaurant/requests',  label: 'Requests',       icon: ClipboardList   }
      ];
    }
    return [];
  }
}
