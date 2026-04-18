import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PickupRequest {
  _id: string;
  foodId: any;
  ngoId: any;
  restaurantId: any;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class RequestService {
  private readonly API = 'http://localhost:5000/api/request';

  constructor(private http: HttpClient) {}

  /** POST /api/request — NGO: create pickup request */
  createRequest(foodId: string): Observable<PickupRequest> {
    return this.http.post<PickupRequest>(this.API, { foodId });
  }

  /** GET /api/request/ngo — NGO: get own requests */
  getNgoRequests(): Observable<PickupRequest[]> {
    return this.http.get<PickupRequest[]>(`${this.API}/ngo`);
  }

  /** GET /api/request/restaurant — Restaurant: get requests for their food */
  getRestaurantRequests(): Observable<PickupRequest[]> {
    return this.http.get<PickupRequest[]>(`${this.API}/restaurant`);
  }

  /** PUT /api/request/:id — Restaurant: update status (approve/reject/complete) */
  updateRequestStatus(id: string, status: 'approved' | 'rejected' | 'completed'): Observable<PickupRequest> {
    return this.http.put<PickupRequest>(`${this.API}/${id}`, { status });
  }
}
