// collection.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  createRequest(requestData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/collectionRequests`, {
      ...requestData,
      status: 'pending',
      createdAt: new Date()
    });
  }

  getRequestsByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/collectionRequests?userId=${userId}`);
  }

  getRequestsByCity(city: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/collectionRequests`).pipe(
      map(requests => requests.filter(req => req.address.includes(city)))
    );
  }

  updateRequest(requestId: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/collectionRequests/${requestId}`, data);
  }

  deleteRequest(requestId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/collectionRequests/${requestId}`);
  }


}
