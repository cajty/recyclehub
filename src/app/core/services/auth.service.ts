import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || 'null'));

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/users?email=${email}`).pipe(
      map(users => {
        const user = users[0];
        if (user && user.password === password) {
          return user;
        }
        throw new Error('Invalid credentials');
      })
    );
  }

  register(userData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/users`, userData).pipe(
    map(response => {
      if (response) {
        this.router.navigate(['/profile']);
        return response;
      } else {
        throw new Error('Registration failed');
      }
    })
  );
}

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  updateUser(userId: number, userData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}`, userData);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }
}
