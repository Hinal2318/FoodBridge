import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Clock, MapPin, Package, Trash2, Eye } from 'lucide-angular';
import { FoodService, FoodListingItem } from '../../../services/food.service';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { AlertComponent } from '../../../shared/alert/alert.component';

@Component({
  selector: 'app-food-list',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, LoaderComponent, AlertComponent],
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss']
})
export class FoodListComponent implements OnInit {
  private foodService = inject(FoodService);

  readonly Clock = Clock;
  readonly MapPin = MapPin;
  readonly Package = Package;
  readonly Trash2 = Trash2;
  readonly Eye = Eye;

  foods: FoodListingItem[] = [];
  loading = true;
  error = '';
  deletingId = '';
  successMsg = '';

  ngOnInit(): void { this.loadFoods(); }

  loadFoods(): void {
    this.loading = true;
    this.foodService.getMyFood().subscribe({
      next: (data) => { this.foods = data; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Failed to load listings.'; this.loading = false; }
    });
  }

  delete(food: FoodListingItem): void {
    if (this.deletingId) return;
    this.deletingId = food._id;
    this.foodService.deleteFood(food._id).subscribe({
      next: () => {
        this.foods = this.foods.filter(f => f._id !== food._id);
        this.deletingId = '';
        this.successMsg = `"${food.name}" removed successfully.`;
      },
      error: (err) => {
        this.deletingId = '';
        this.error = err?.error?.message || 'Failed to delete listing.';
      }
    });
  }

  getExpiryLabel(expiryTime: string): string {
    const diff = new Date(expiryTime).getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (diff < 0) return 'Expired';
    if (hours < 24) return `${hours}h left`;
    if (days === 1) return 'Tomorrow';
    return `${days} days left`;
  }

  isExpired(expiryTime: string): boolean {
    return new Date(expiryTime) < new Date();
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      available: 'bg-green-100 text-green-700',
      requested: 'bg-blue-100 text-blue-700',
      picked: 'bg-gray-100 text-gray-500',
    };
    return map[status] ?? 'bg-gray-100 text-gray-500';
  }
}
