import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Loader2, Leaf, RefreshCw } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';


export type LoaderVariant = 'spinner' | 'dots' | 'pulse' | 'fullscreen';
export type LoaderSize = 'sm' | 'md' | 'lg';
export type LoaderColor = 'green' | 'blue';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
    constructor(public authService: AuthService) {}


    // Lucide icons
    readonly Loader2 = Loader2;
    readonly Leaf = Leaf;
    readonly RefreshCw = RefreshCw;

    /** Visual variant */
    @Input() variant: LoaderVariant = 'spinner';

    /** Size (applies to spinner + dots) */
    @Input() size: LoaderSize = 'md';

    /** Color theme */
    @Input() color: LoaderColor = 'green';

    /** Optional text shown below the loader */
    @Input() message = '';

    /**
     * Overlay — covers the nearest `relative` parent.
     * For full-viewport, use variant="fullscreen" instead.
     */
    @Input() overlay = false;

    // ── Computed helpers ────────────────────────────────────────────

    /** Tailwind classes for the lucide-icon size */
    get iconSizeClass(): string {
        const map: Record<LoaderSize, string> = {
            sm: 'w-5 h-5',
            md: 'w-8 h-8',
            lg: 'w-12 h-12',
        };
        return map[this.size];
    }

    /** Tailwind color for the spinning icon */
    get iconColorClass(): string {
        return this.color === 'blue' ? 'text-[#6B8CFF]' : 'text-[#7ED7A5]';
    }

    /** Dot size classes */
    get dotSizeClass(): string {
        const map: Record<LoaderSize, string> = {
            sm: 'w-2 h-2',
            md: 'w-2.5 h-2.5',
            lg: 'w-3.5 h-3.5',
        };
        return map[this.size];
    }

    /** Dot color */
    get dotColorClass(): string {
        return this.color === 'blue' ? 'bg-[#6B8CFF]' : 'bg-[#7ED7A5]';
    }
}