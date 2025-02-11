import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import {Observable, switchMap} from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}


  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getUserByEmail(email: string): Observable<User> {
    const params = new HttpParams().set('email', email);
    return this.http.get<User[]>(`${this.apiUrl}`, { params })
      .pipe(map(users => users[0]));
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateUserPoints(id: string, points: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, { points });
  }


  convertPointsToBalance(id: string, points: number, amount :number ): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      map(user => {
        const newBalance = user.balance + amount ;
        const newPoints = user.points - points;
        return {...user, balance: newBalance, points: newPoints};
      }),
      switchMap(updatedUser => this.updateUser(id, updatedUser))
    );
  }

  getCollectorsByCity(city: string): Observable<User[]> {
    const params = new HttpParams()
      .set('userType', 'collector')
      .set('q', city);

    return this.http.get<User[]>(this.apiUrl, { params })
      .pipe(map(users => users.filter(user =>
        user.address?.toLowerCase().includes(city.toLowerCase())
      )));
  }
}
