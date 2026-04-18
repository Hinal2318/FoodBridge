import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Package, ClipboardList, PlusCircle, TrendingUp, CheckCircle } from 'lucide-angular';
import { AuthService } from '../../../services/auth.service';
import { StatsService, RestaurantStats } from '../../../services/Stats.service';
import { StatsCardComponent } from '../../../shared/stats-card/stats-card.component';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { LoaderComponent } from '../../../shared/loader/loader.component';

@Component({
  selector: 'app-restaurant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, StatsCardComponent, AlertComponent, LoaderComponent],
  templateUrl: './restaurant-dashboard.component.html',
  styleUrls: ['./restaurant-dashboard.component.scss']
})
export class RestaurantDashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private statsService = inject(StatsService);

  readonly Package = Package;
  readonly PlusCircle = PlusCircle;
  readonly TrendingUp = TrendingUp;
  readonly ClipboardList = ClipboardList;
  readonly CheckCircle = CheckCircle;

  stats: RestaurantStats | null = null;
  loading = true;
  error = '';

  get user() { return this.auth.currentUser(); }

  ngOnInit(): void { this.loadStats(); }

  loadStats(): void {
    this.loading = true;
    this.error = '';
    this.statsService.getStats().subscribe({
      next: (data) => { this.stats = data as RestaurantStats; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Failed to load stats.'; this.loading = false; }
    });
  }
}
