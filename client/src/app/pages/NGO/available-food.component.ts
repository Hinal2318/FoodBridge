import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Clock, MapPin, Package, HandHeart, Loader2 } from 'lucide-angular';
import { FoodService, FoodListingItem } from '../../services/food.service';
import { RequestService } from '../../services/request.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { AlertComponent } from '../../shared/alert/alert.component';

@Component({
  selector: 'app-available-food',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, LoaderComponent, AlertComponent],
  templateUrl: './available-food.component.html',
  styleUrls: ['./available-food.component.scss']
})

export class AvailableFoodComponent implements OnInit {
  private foodService = inject(FoodService);
  private requestService = inject(RequestService);

  readonly Search = Search;
  readonly Clock = Clock;
  readonly MapPin = MapPin;
  readonly Package = Package;
  readonly HandHeart = HandHeart;
  readonly Loader2 = Loader2;

  foods: FoodListingItem[] = [];
  loading = true;
  error = '';
  searchCity = '';

  requestingId = '';
  successMsg = '';

  ngOnInit(): void { this.loadFood(); }

  loadFood(): void {
    this.loading = true;
    this.error = '';
    this.foodService.getAvailableFood(this.searchCity).subscribe({
      next: (data) => { this.foods = data; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Failed to load available food.'; this.loading = false; }
    });
  }

  onSearch(): void {
    this.loadFood();
  }

  requestFood(foodId: string): void {
    if (this.requestingId) return;
    this.requestingId = foodId;
    this.successMsg = '';
    this.error = '';

    this.requestService.createRequest(foodId).subscribe({
      next: () => {
        this.requestingId = '';
        this.successMsg = '✅ Pickup request sent! Check your requests tab.';
        // Remove from list
        this.foods = this.foods.filter(f => f._id !== foodId);
      },
      error: (err) => {
        this.requestingId = '';
        this.error = err?.error?.message || 'Failed to request food.';
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
}
