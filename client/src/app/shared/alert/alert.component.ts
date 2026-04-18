import {
    Component, Input, Output, EventEmitter,
    OnInit, OnChanges, OnDestroy, SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    trigger, transition, style, animate,
} from '@angular/animations';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info,
    X,
} from 'lucide-angular';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

// ─── Per-type visual config ──────────────────────────────────────────────────
interface AlertConfig {
    icon: any;          // lucide icon object
    barColor: string;   // left accent bar bg
    wrapperClass: string;
    iconWrapClass: string;
    iconClass: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
@Component({
    selector: 'app-alert',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    animations: [
        trigger('alertAnim', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(-10px) scale(0.97)' }),
                animate(
                    '220ms cubic-bezier(0.4, 0, 0.2, 1)',
                    style({ opacity: 1, transform: 'translateY(0) scale(1)' })
                ),
            ]),
            transition(':leave', [
                animate(
                    '160ms cubic-bezier(0.4, 0, 0.2, 1)',
                    style({ opacity: 0, transform: 'translateY(-6px) scale(0.97)' })
                ),
            ]),
        ]),
    ],
})
export class AlertComponent implements OnInit, OnChanges, OnDestroy {
    constructor(public authService: AuthService) {}


    // ── Inputs ────────────────────────────────────────────────────────
    /** Alert type — controls icon, color and accent */
    @Input() type: AlertType = 'info';

    /** Primary message text */
    @Input() message = '';

    /** Optional secondary description */
    @Input() description = '';

    /** Show the ✕ close button */
    @Input() dismissible = true;

    /**
     * Auto-dismiss after N ms.
     * 0 = never auto-dismiss.
     */
    @Input() autoClose = 0;

    /** Programmatic show/hide */
    @Input() show = true;

    // ── Outputs ───────────────────────────────────────────────────────
    @Output() dismissed = new EventEmitter<void>();

    // ── State ─────────────────────────────────────────────────────────
    visible = true;
    private _timer: ReturnType<typeof setTimeout> | null = null;

    // ── Lifecycle ─────────────────────────────────────────────────────
    ngOnInit(): void {
        this.visible = this.show;
        this._scheduleAutoClose();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['show']) {
            this.visible = this.show;
            if (this.show) this._scheduleAutoClose();
        }
    }

    ngOnDestroy(): void {
        if (this._timer) clearTimeout(this._timer);
    }

    // ── Actions ───────────────────────────────────────────────────────
    dismiss(): void {
        this.visible = false;
        if (this._timer) clearTimeout(this._timer);
        // emit after leave animation
        setTimeout(() => this.dismissed.emit(), 180);
    }

    // ── Config map ────────────────────────────────────────────────────
    getConfig(): AlertConfig {
        const map: Record<AlertType, AlertConfig> = {
            success: {
                icon: CheckCircle2,
                barColor: '#7ED7A5',
                wrapperClass: 'border border-[#7ED7A5]/30 bg-[#E8F8EF]/60',
                iconWrapClass: 'bg-[#E8F8EF] text-[#22a261]',
                iconClass: 'text-[#22a261]',
            },
            error: {
                icon: XCircle,
                barColor: '#f87171',
                wrapperClass: 'border border-red-200/50 bg-red-50/60',
                iconWrapClass: 'bg-red-50 text-red-500',
                iconClass: 'text-red-500',
            },
            warning: {
                icon: AlertTriangle,
                barColor: '#fbbf24',
                wrapperClass: 'border border-amber-200/50 bg-amber-50/60',
                iconWrapClass: 'bg-amber-50 text-amber-500',
                iconClass: 'text-amber-500',
            },
            info: {
                icon: Info,
                barColor: '#6B8CFF',
                wrapperClass: 'border border-[#6B8CFF]/25 bg-blue-50/50',
                iconWrapClass: 'bg-blue-50 text-[#6B8CFF]',
                iconClass: 'text-[#6B8CFF]',
            },
        };
        return map[this.type];
    }

    getProgressColor(): string {
        const map: Record<AlertType, string> = {
            success: '#7ED7A5',
            error: '#f87171',
            warning: '#fbbf24',
            info: '#6B8CFF',
        };
        return map[this.type];
    }

    // ── Private ───────────────────────────────────────────────────────
    private _scheduleAutoClose(): void {
        if (this.autoClose > 0) {
            if (this._timer) clearTimeout(this._timer);
            this._timer = setTimeout(() => this.dismiss(), this.autoClose);
        }
    }

    // Expose X icon to template
    readonly XIcon = X;
}