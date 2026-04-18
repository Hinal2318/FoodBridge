import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import {
    MapPin,
    ShoppingBasket,
    Clock,
    Store,
    UserPlus,
    Check,
    Trash2,
    Eye,
    Loader2,
} from 'lucide-angular';
import { AuthService } from '../../services/auth.service';


// ─── Types ────────────────────────────────────────────────────────────────────

export type FoodStatus = 'available' | 'requested' | 'picked';
export type FoodUnit = 'kg' | 'pieces' | 'litres' | 'packets';

export interface FoodItem {
    id: string;
    name: string;
    restaurantName: string;
    quantity: number;
    unit: FoodUnit;
    expiryTime: Date | string;
    location: string;
    description?: string;
    status: FoodStatus;
    category?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
    selector: 'app-food-card',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './food-card.component.html',
    styleUrls: ['./food-card.component.scss'],
})
export class FoodCardComponent {
    constructor(public authService: AuthService) {}


    // Expose icons to template
    readonly MapPin = MapPin;
    readonly ShoppingBasket = ShoppingBasket;
    readonly Clock = Clock;
    readonly Store = Store;
    readonly UserPlus = UserPlus;
    readonly Check = Check;
    readonly Trash2 = Trash2;
    readonly Eye = Eye;
    readonly Loader2 = Loader2;

    // ── Inputs ────────────────────────────────────────────────────────
    @Input() food!: FoodItem;

    /** NGO view — show "Request Pickup" button */
    @Input() showRequestButton = false;

    /** Disable request button after request is already sent */
    @Input() requestSent = false;

    /** Restaurant view — show Delete + View Requests buttons */
    @Input() showDeleteButton = false;

    /** Loading spinner while API call is in-flight */
    @Input() loading = false;

    // ── Outputs ───────────────────────────────────────────────────────
    @Output() onRequest = new EventEmitter<FoodItem>();
    @Output() onDelete = new EventEmitter<FoodItem>();
    @Output() onViewRequests = new EventEmitter<FoodItem>();

    // ── Handlers ──────────────────────────────────────────────────────
    handleRequest(): void {
        if (!this.requestSent && !this.loading && !this.isExpired()) {
            this.onRequest.emit(this.food);
        }
    }

    handleDelete(): void {
        if (!this.loading) this.onDelete.emit(this.food);
    }

    handleViewRequests(): void {
        this.onViewRequests.emit(this.food);
    }

    // ── Expiry helpers ────────────────────────────────────────────────
    isExpired(): boolean {
        return new Date(this.food.expiryTime) < new Date();
    }

    isExpiringSoon(): boolean {
        const ms = new Date(this.food.expiryTime).getTime() - Date.now();
        return ms > 0 && ms < 1000 * 60 * 60 * 24;
    }

    getExpiryLabel(): string {
        const diff = new Date(this.food.expiryTime).getTime() - Date.now();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        if (diff < 0) return 'Expired';
        if (hours < 24) return `Expires in ${hours}h`;
        if (days === 1) return 'Expires tomorrow';
        return `Expires in ${days} days`;
    }

    // ── Status helpers ────────────────────────────────────────────────
    getStatusClasses(): string {
        const map: Record<FoodStatus, string> = {
            available: 'bg-[#E8F8EF] text-[#22a261]',
            requested: 'bg-blue-100 text-[#4a67d6]',
            picked: 'bg-gray-100 text-gray-500',
        };
        return map[this.food.status];
    }

    getStatusLabel(): string {
        const map: Record<FoodStatus, string> = {
            available: 'Available',
            requested: 'Requested',
            picked: 'Picked Up',
        };
        return map[this.food.status];
    }

    // ── Category emoji ────────────────────────────────────────────────
    getCategoryEmoji(): string {
        const map: Record<string, string> = {
            cooked: '🍛',
            baked: '🍞',
            produce: '🥦',
            dairy: '🧀',
            beverages: '🥤',
            dry: '🌾',
        };
        return this.food.category ? (map[this.food.category] ?? '🍱') : '🍱';
    }
}