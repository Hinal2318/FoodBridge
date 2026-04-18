import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FoodListingPayload {
  name: string;
  quantity: number;
  unit: 'kg' | 'pieces' | 'litres' | 'packets';
  expiryTime: string;
  location: string;
  description?: string;
}

export interface FoodListingItem {
  _id: string;
  restaurantId: any; // Can be string or populated object { name, location }
  name: string;
  quantity: number;
  unit: string;
  expiryTime: string;
  location: string;
  description?: string;
  status: 'available' | 'requested' | 'picked';
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class FoodService {
  private readonly API = 'http://localhost:5000/api/food';

  constructor(private http: HttpClient) {}

  /** POST /api/food — Restaurant: create food listing */
  addFood(payload: FoodListingPayload): Observable<FoodListingItem> {
    return this.http.post<FoodListingItem>(this.API, payload);
  }

  /** GET /api/food — Restaurant: get own food listings */
  getMyFood(): Observable<FoodListingItem[]> {
    return this.http.get<FoodListingItem[]>(this.API);
  }

  /** GET /api/food/available — NGO: get all available food */
  getAvailableFood(city?: string): Observable<FoodListingItem[]> {
    const url = city ? `${this.API}/available?city=${city}` : `${this.API}/available`;
    return this.http.get<FoodListingItem[]>(url);
  }

  /** DELETE /api/food/:id — Restaurant: delete own listing */
  deleteFood(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API}/${id}`);
  }
}
