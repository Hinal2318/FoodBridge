import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-restaurant-requests',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-2xl font-bold mb-4">Requests</h1>
      <p class="text-gray-500">Coming soon.</p>
    </div>
  `
})
export class RestaurantRequestsComponent {}
