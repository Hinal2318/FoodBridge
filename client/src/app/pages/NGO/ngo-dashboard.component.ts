import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Package, ClipboardList, CheckCircle } from 'lucide-angular';

import { LoaderComponent } from '../../shared/loader/loader.component';
import { AlertComponent } from '../../shared/alert/alert.component';
import { StatsCardComponent } from '../../shared/stats-card/stats-card.component';

import { StatsService, NgoStats } from '../../services/Stats.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-ngo-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        LoaderComponent,
        AlertComponent,
        StatsCardComponent
    ],
    templateUrl: './ngo-dashboard.component.html',
    styleUrls: ['./ngo-dashboard.component.scss']
})
export class NgoDashboardComponent implements OnInit {
    private statsService = inject(StatsService);
    auth = inject(AuthService);

    readonly Package = Package;
    readonly ClipboardList = ClipboardList;
    readonly CheckCircle = CheckCircle;

    stats: NgoStats | null = null;
    loading = true;
    error = '';

    get user() { return this.auth.currentUser(); }

    ngOnInit(): void {
        this.loadStats();
    }

    loadStats(): void {
        this.loading = true;
        this.error = '';

        this.statsService.getStats().subscribe({
            next: (data) => {
                this.stats = data as NgoStats;
                this.loading = false;
            },
            error: (err) => {
                this.error = err?.error?.message || 'Failed to load dashboard. Please try again.';
                this.loading = false;
            }
        });
    }

    formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    }
}