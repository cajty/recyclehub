import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CollectionRequest } from '../../models/collectionRequests.model';
import { Waste } from '../../models/waste.model';
import { CollectionStatus } from '../../models/CollectionStatus';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private apiUrl = 'http://localhost:3000/collectionRequests';

  constructor(private http: HttpClient) {}

  createRequest(request: CollectionRequest): Observable<CollectionRequest> {
    return this.http.post<CollectionRequest>(this.apiUrl, request);
  }

  getUserRequests(userId: string): Observable<CollectionRequest[]> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<CollectionRequest[]>(this.apiUrl, { params });
  }

getPendingRequests(): Observable<CollectionRequest[]> {
  const params = new HttpParams().set('status', CollectionStatus.Pending);
  return this.http.get<CollectionRequest[]>(this.apiUrl, { params });
}

  getRequestById(requestId: string): Observable<CollectionRequest> {
    return this.http.get<CollectionRequest>(`${this.apiUrl}/${requestId}`);
  }

  updateRequestStatus(
    requestId: string,
    newStatus: CollectionStatus,
    collectorId?: number
  ): Observable<CollectionRequest> {
    const updates = {
      status: newStatus,
      ...(collectorId && { collectorId })
    };
    return this.http.patch<CollectionRequest>(
      `${this.apiUrl}/${requestId}`,
      updates
    );
  }



  deleteRequest(requestId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${requestId}`);
  }

  updateRequest(
    requestId: string,
    updates: CollectionRequest
  ): Observable<CollectionRequest> {
    const validUpdates = {
      ...updates,
      status: CollectionStatus.Pending,
      collectorId: null
    };
    return this.http.patch<CollectionRequest>(
      `${this.apiUrl}/${requestId}`,
      validUpdates
    );
  }
}
