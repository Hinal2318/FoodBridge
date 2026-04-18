import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Shape returned by GET /api/stats for role=ngo
export interface NgoStats {
    availableFood: number;  // blue card
    pickupRequestsSent: number;  // purple card
    completedPickups: number;  // green card
    recentDonations: {
        _id: string;
        foodId: { name: string };
        restaurantId: { name: string; location: string };
        updatedAt: string;
    }[];
}

// Shape returned by GET /api/stats for role=restaurant
export interface RestaurantStats {
    totalListings: number;
    activeListings: number;
    pendingRequests: number;
    completedPickups: number;
}

@Injectable({ providedIn: 'root' })
export class StatsService {
    private readonly API = 'http://localhost:5000/api/stats';

    constructor(private http: HttpClient) { }

    // Token is attached automatically by auth.interceptor.ts
    getStats(): Observable<NgoStats | RestaurantStats> {
        return this.http.get<NgoStats | RestaurantStats>(this.API);
    }
}